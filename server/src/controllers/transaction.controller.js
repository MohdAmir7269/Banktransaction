const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ladger.model");

exports.createTransaction = async (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;

    console.log("🔥 Body received:", { fromAccount, toAccount, amount });

    if (!fromAccount || !toAccount || !amount) {
        return res.status(400).json({ success: false, message: "fromAccount, toAccount and amount are required" });
    }

    if (amount <= 0) {
        return res.status(400).json({ success: false, message: "Amount must be > 0" });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const sender = await accountModel.findOne({ user: fromAccount }).session(session);
        const receiver = await accountModel.findOne({ user: toAccount }).session(session);

        console.log("👤 Sender found:", sender?._id);
        console.log("👤 Receiver found:", receiver?._id);

        if (!sender || !receiver) {
            throw new Error("One or both accounts not found");
        }

        if (sender.balance < amount) {
            throw new Error("Insufficient balance in sender account");
        }

        // ✅ FIX: User _id store karo (history route se match hoga)
        const [transaction] = await transactionModel.create([{
            fromAccount: fromAccount,
            toAccount: toAccount,
            amount,
            status: "PENDING",
            idempotencyKey: `${fromAccount}-${toAccount}-${Date.now()}`
        }], { session });

        // Ledger mein Account _id store karo (sahi hai)
        await ledgerModel.create([
            { account: sender._id, type: "DEBIT", amount, transaction: transaction._id },
            { account: receiver._id, type: "CREDIT", amount, transaction: transaction._id }
        ], { session, ordered: true });

        sender.balance -= Number(amount);
        receiver.balance += Number(amount);

        await sender.save({ session });
        await receiver.save({ session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();

        return res.status(201).json({ success: true, message: "Transfer Successful", transaction });

    } catch (error) {
        await session.abortTransaction();
        console.error("❌ Transaction Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

exports.createInitialFundsTransaction = async (req, res) => {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ success: false, message: "toAccount, amount and idempotencyKey are required" });
    }

    if (amount <= 0) {
        return res.status(400).json({ success: false, message: "Amount must be > 0" });
    }

    const existingTxn = await transactionModel.findOne({ idempotencyKey });
    if (existingTxn) {
        return res.status(200).json({ success: true, message: "Transaction already processed", transaction: existingTxn });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const toUserAccount = await accountModel.findById(toAccount).session(session);
        const systemAccount = await accountModel.findOne({ systemUser: true }).session(session);

        if (!toUserAccount || !systemAccount) {
            throw new Error("Accounts not found");
        }

        const [transaction] = await transactionModel.create([{
            fromAccount: systemAccount._id,
            toAccount: toUserAccount._id,
            amount,
            idempotencyKey,
            status: "COMPLETED"
        }], { session });

        await ledgerModel.create([
            { account: systemAccount._id, type: "DEBIT", amount, transaction: transaction._id },
            { account: toUserAccount._id, type: "CREDIT", amount, transaction: transaction._id }
        ], { session, ordered: true });

        systemAccount.balance -= Number(amount);
        toUserAccount.balance += Number(amount);

        await systemAccount.save({ session });
        await toUserAccount.save({ session });

        await session.commitTransaction();

        res.status(201).json({ success: true, message: "Initial funds added successfully", transaction });

    } catch (error) {
        await session.abortTransaction();
        console.error("❌ Initial Funds Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};