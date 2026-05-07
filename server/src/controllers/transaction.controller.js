
const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");

/**
 * ==========================================
 * 💸 CREATE TRANSACTION (USER → USER)
 * ==========================================
 */
exports.createTransaction = async (req, res) => {
    const userId = req.user._id; // ✅ Logged-in user (sender)
    const { toAccount, amount } = req.body;

    console.log("🔥 Request Body:", { userId, toAccount, amount });

    // ✅ Validation
    if (!toAccount || !amount) {
        return res.status(400).json({
            success: false,
            message: "toAccount and amount are required"
        });
    }

    const transferAmount = Number(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be a valid number greater than 0"
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        /**
         * ✅ IMPORTANT FIX
         * Account query me userId use karo (NOT user)
         */
        const senderAccount = await accountModel
            .findOne({ user: userId })
            .session(session);

        const receiverAccount = await accountModel
            .findOne({ _id: toAccount })
            .session(session);

        console.log("👤 Sender Account:", senderAccount?._id);
        console.log("👤 Receiver Account:", receiverAccount?._id);

        // ❌ Account exist check
        if (!senderAccount || !receiverAccount) {
            throw new Error("Sender or Receiver account not found");
        }

        // ❌ Self transfer (account level pe check karo)
        if (senderAccount._id.toString() === receiverAccount._id.toString()) {
            throw new Error("Cannot transfer to your own account");
        }

        // ❌ Account status check
        if (senderAccount.status !== "ACTIVE" || receiverAccount.status !== "ACTIVE") {
            throw new Error("One or both accounts are not active");
        }

        // ❌ Balance check
        if (senderAccount.balance < transferAmount) {
            throw new Error("Insufficient balance");
        }

        /**
         * ✅ Transaction create
         */
        const [transaction] = await transactionModel.create(
            [
                {
                    fromAccount: senderAccount._id,
                    toAccount: receiverAccount._id,
                    amount: transferAmount,
                    status: "PENDING",
                    idempotencyKey: `${senderAccount._id}-${receiverAccount._id}-${Date.now()}`
                }
            ],
            { session }
        );

        /**
         * ✅ Ledger entries
         */
        await ledgerModel.create(
            [
                {
                    account: senderAccount._id,
                    type: "DEBIT",
                    amount: transferAmount,
                    transaction: transaction._id
                },
                {
                    account: receiverAccount._id,
                    type: "CREDIT",
                    amount: transferAmount,
                    transaction: transaction._id
                }
            ],
            { session,ordered:true }
        );

        /**
         * ✅ Balance update
         */
        senderAccount.balance -= transferAmount;
        receiverAccount.balance += transferAmount;

        await senderAccount.save({ session });
        await receiverAccount.save({ session });

        /**
         * ✅ Final status update
         */
        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "✅ Transfer Successful",
            transaction
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("❌ Transaction Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};



/**
 * ==========================================
 * 💰 SYSTEM → USER (INITIAL FUNDS)
 * ==========================================
 */
exports.createInitialFundsTransaction = async (req, res) => {
    const { toAccount, amount, idempotencyKey } = req.body;

    console.log("💰 Initial Fund Request:", { toAccount, amount });

    // ✅ Validation
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            success: false,
            message: "toAccount, amount and idempotencyKey are required"
        });
    }

    const fundAmount = Number(amount);

    if (isNaN(fundAmount) || fundAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be greater than 0"
        });
    }

    // ✅ Duplicate transaction protection
    const existingTxn = await transactionModel.findOne({ idempotencyKey });

    if (existingTxn) {
        return res.status(200).json({
            success: true,
            message: "Transaction already processed",
            transaction: existingTxn
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        /**
         * ✅ Receiver account (by accountId)
         */
        const receiverAccount = await accountModel
            .findById(toAccount)
            .session(session);

        /**
         * ✅ System account
         */
        const systemAccount = await accountModel
            .findOne({ systemUser: true })
            .session(session);

        if (!receiverAccount || !systemAccount) {
            throw new Error("Receiver or System account not found");
        }

        /**
         * ✅ Create transaction
         */
        const [transaction] = await transactionModel.create(
            [
                {
                    fromAccount: systemAccount._id,
                    toAccount: receiverAccount._id,
                    amount: fundAmount,
                    idempotencyKey,
                    status: "COMPLETED"
                }
            ],
            { session }
        );

        /**
         * ✅ Ledger
         */
        await ledgerModel.create(
            [
                {
                    account: systemAccount._id,
                    type: "DEBIT",
                    amount: fundAmount,
                    transaction: transaction._id
                },
                {
                    account: receiverAccount._id,
                    type: "CREDIT",
                    amount: fundAmount,
                    transaction: transaction._id
                }
            ],
            { session }
        );

        /**
         * ✅ Balance update
         */
        systemAccount.balance -= fundAmount;
        receiverAccount.balance += fundAmount;

        await systemAccount.save({ session });
        await receiverAccount.save({ session });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "✅ Initial funds added successfully",
            transaction
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("❌ Initial Funds Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};