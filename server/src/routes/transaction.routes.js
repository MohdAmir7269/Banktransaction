

const { Router } = require("express");
const { authMiddleware, authSystemUserMiddleware } = require("../middlewares/auth.middlewares");
const transactionController = require("../controllers/transaction.controller");

// ⚠️ YE LINE ADD KAREIN (Check your model path)
const transactionModel = require("../models/transaction.model"); 
const accountModel = require("../models/account.model");

const transactionRoutes = Router();

/**
 * GET /api/transactions/history
 * Fetch Ledger data for the logged-in user
 */
transactionRoutes.get("/history", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("🔍 Searching transactions for User ID:", userId);

        // ✅ FIX: Account _id se nahi, User _id se directly match karo
        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: userId },
                { toAccount: userId }
            ]
        })
        .sort({ createdAt: -1 })
        .lean();

        console.log("✅ Transactions Found:", transactions.length);

        res.json({
            success: true,
            transactions: transactions,
            currentUserId: userId  // Frontend ke liye
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/transactions/
 */
transactionRoutes.post(
  "/",
  authMiddleware,
  transactionController.createTransaction
);

/**
 * POST /api/transactions/system/initial-funds
 */
transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware,
  authSystemUserMiddleware,
  transactionController.createInitialFundsTransaction
);

module.exports = transactionRoutes;