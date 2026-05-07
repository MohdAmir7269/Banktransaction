const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const accountModel = require("../models/account.model");

// 🔍 SEARCH USER (email, name, ya account number se)

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query required" });
    }

    let user = null;
    let account = null;

    // ✅ Pehle email se search
    user = await User.findOne({
      $or: [
        { email: query.toLowerCase() },
        { name: { $regex: query, $options: "i" } }
      ]
    });

    if (user) {
      account = await accountModel.findOne({ user: user._id }); // ✅ 'user' field
    }

    if (!user || !account) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        accountNumber: account._id,  // ✅ accountNumber nahi hai — _id use karo
        accountId: account._id
      }
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;