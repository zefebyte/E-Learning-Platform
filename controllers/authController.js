const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user, remember = false) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: remember ? "7d" : "1d" }
    );
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            // Ideally we'd pass this error to the view, but let's keep it simple
            return res.render("signup", { error: "Email already in use" });
        }

        const profilePicture = req.file ? "/uploads/" + req.file.filename : "";
        const user = new User({ username, email, password, profilePicture });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.render("signup", { error: "Signup failed. Try again." });
    }
};

exports.login = async (req, res) => {
    const { username, password, remember } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !user.password) {
            return res.render("login", { error: "Invalid username or password" });
        }
        const match = await user.comparePassword(password);
        if (!match) return res.render("login", { error: "Invalid username or password" });

        const token = generateToken(user, remember);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        });

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.render("login", { error: "Login failed. Try again." });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};

exports.googleCallback = (req, res) => {
    // Generate JWT for Google users
    const token = generateToken(req.user, true); // default 7 days for google
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect("/");
};
