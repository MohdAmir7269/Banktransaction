const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailServices = require("../services/email.service");
const tokenBlackListModel = require("../models/blacklist.model");
const accountModel = require("../models/account.model"); // ✅ MUST: Account model import karein

/* =========================================================
   1. REGISTER (SIGNUP) - Naya User Banane ke liye
   ========================================================= */
async function userRegisterController(req, res) {
    try {
        const { email, password, name } = req.body;

        // Check agar user pehle se hai
        const isExists = await userModel.findOne({ email });
        if (isExists) {
            return res.status(422).json({
                message: "User already exists with this email.",
                status: "failed"
            });
        }

        // A. User create karein
        const user = await userModel.create({ email, password, name });

        // ✅ B. Account create karein (Isse 'Account not linked' fix ho jayega)
        await accountModel.create({
            user: user._id,
            balance: 5000,// Naye user ko 5000 Welcome Balance
            status:"ACTIVE", 
            currancy:"INR",
            accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        });

        // Email bhejein
        await emailServices.sendRegistrationEmail(user.email, user.name);

        // Token generate karein
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            user: { _id: user._id, email: user.email, name: user.name },
            token
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, status: "failed" });
    }
}

/* =========================================================
   2. LOGIN - Purane User ko Entry dene ke liye
   ========================================================= */
async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        // User dhoondo aur password select karo
        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Email or password is INVALID" });
        }

        // Password match karein (bcrypt)
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Email or password is INVALID" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user: { _id: user._id, email: user.email, name: user.name },
            token
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, status: "failed" });
    }
}

/* =========================================================
   3. LOGOUT - Session khatam karne ke liye
   ========================================================= */
async function userLogoutController(req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        if (token) {
            await tokenBlackListModel.create({ token: token });
        }

        res.clearCookie('token');
        
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};