const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateJWT(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch the full user to ensure profilePicture, createdAt, etc., are available
        const user = await User.findById(decoded.id).select("-password");
        req.user = user || decoded; // fallback to decoded if user deleted
        next();
    } catch (err) {
        req.user = null;
        // If token is invalid, clear it
        res.clearCookie("token");
        next();
    }
}

function requireLogin(req, res, next) {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
}

module.exports = { authenticateJWT, requireLogin };
