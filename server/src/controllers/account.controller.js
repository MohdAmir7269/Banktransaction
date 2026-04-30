const accountModel = require("../models/account.model");
const mongoose = require("mongoose");

// ✅ Create Account (Duplicate check added)
async function createAccountController(req, res) {
    try {
        const user = req.user;

        // 🔒 Check if account already exists
        const existingAccount = await accountModel.findOne({ user: user._id });

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: "Account already exists"
            });
        }

        const account = await accountModel.create({
            user: user._id
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            account
        });

    } catch (error) {
        console.error("Create Account Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ✅ Get User Account (single account assumed)
async function getUserAccountController(req, res) {
    try {
        const account = await accountModel.findOne({ user: req.user._id });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            account
        });

    } catch (error) {
        console.error("Get Account Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ✅ Get Account Balance (validated + safe)
async function getAccountBalanceController(req, res) {
    try {
        const { accountId } = req.params;

        //  Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account ID"
            });
        }

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        //  Check method exists
        if (typeof account.getBalance !== "function") {
            return res.status(500).json({
                success: false,
                message: "Balance method not defined"
            });
        }

        const balance = await account.getBalance();

        res.status(200).json({
            success: true,
            accountId: account._id,
            balance
        });

    } catch (error) {
        console.error("Get Balance Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
};