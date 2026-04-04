

const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middlewares");
const accountController = require("../controllers/account.controller");

const router = express.Router();

/** 
 * POST /api/account/
 * Create a new account
 */
router.post(
    "/",
    authMiddleware,
    accountController.createAccountController
);

/** 
 * GET /api/account/
 * Get all user accounts
 */
router.get(
    "/",
    authMiddleware,
    accountController.getUserAccountController  // ✅ FIXED: was calling createAccountController
);

/**
 * GET /api/account/balance/:accountId
 */
router.get(
    "/balance/:accountId",
    authMiddleware,
    accountController.getAccountBalanceController  // ✅ FIXED: spelling
);

module.exports = router;