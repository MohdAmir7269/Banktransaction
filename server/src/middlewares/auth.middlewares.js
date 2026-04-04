const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");

// ✅ Auth Middleware
async function authMiddleware(req, res, next) {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing",
        });
    }

    const isBlacklisted = await tokenBlackListModel.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, invalid token",
        });
    }
}

// ✅ System User Middleware (Fixed)
async function authSystemUserMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized access, user missing",
        });
    }

    if (!req.user.systemUser) {
        return res.status(403).json({
            message: "Forbidden access, not a system user",
        });
    }

    next();
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware,
};