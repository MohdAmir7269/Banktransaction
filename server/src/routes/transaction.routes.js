const { Router } = require("express");
const { authMiddleware, authSystemUserMiddleware } = require("../middlewares/auth.middlewares");
const transactionController = require("../controllers/transaction.controller");
const transactionModel = require("../models/transaction.model"); 
const accountModel = require("../models/account.model");

const transactionRoutes = Router();

/**
 * GET /api/transactions/history
 */
transactionRoutes.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ FIXED: userId → user
    const account = await accountModel.findOne({ user: userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    const transactions = await transactionModel.find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

    res.json({
      success: true,
      transactions,
      currentUserId: userId
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

transactionRoutes.post("/", authMiddleware, transactionController.createTransaction);

transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware,
  authSystemUserMiddleware,
  transactionController.createInitialFundsTransaction
);

module.exports = transactionRoutes;