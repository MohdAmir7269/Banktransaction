
const express = require("express");
const authController = require("../controllers/auth.controller");
const tokenBlackListModel = require("../models/blacklist.model");
const router = express.Router();


// Blacklisted tokens dekhne ke liye (Admin/Testing ke liye)
router.get('/blacklist-data', async (req, res) => {
    try {
        const list = await tokenBlackListModel.find().sort({ createdAt: -1 });
        res.json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/register', authController.userRegisterController);
router.post('/login', authController.userLoginController);
router.post('/logout', authController.userLogoutController);  // ✅ FIXED: "/" not "./"

module.exports = router;