

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

    // ✅ Step 1: user ka account nikalo
    const account = await accountModel.findOne({ user: userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    // ✅ Step 2: account._id se transactions fetch karo
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