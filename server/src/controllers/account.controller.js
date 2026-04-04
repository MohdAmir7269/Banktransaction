

const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
    try {
        const user = req.user;

        const account = await accountModel.create({
            user: user._id
        });
        
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getUserAccountController(req, res) {
    try {
        const accounts = await accountModel.find({ user: req.user._id });

        res.status(200).json({
            success: true,
            accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getAccountBalanceController(req, res) {
    try {
        const { accountId } = req.params;

        // ✅ FIXED: Remove 'balance:1000' from query
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

        const balance = await account.getBalance();

        res.status(200).json({
            success: true,
            accountId: account._id,
            balance: balance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController  // ✅ spelling fixed
};