const express = require("express");
const router = express.Router();
const { authenticateJWT, requireLogin } = require("../middleware/auth");

// We apply authenticateJWT globally or explicitly. We'll apply it explicitly where needed.
// However, since we want `user` available in all views for the header, 
// it's best if `authenticateJWT` is applied globally in server.js.

// Protected Home/Dashboard route
router.get("/", requireLogin, (req, res) => {
    res.render("index", { user: req.user });
});

router.get("/dashboard", requireLogin, (req, res) => {
    res.render("dashboard", { user: req.user });
});

const upload = require("../middleware/upload");
const User = require("../models/User");

router.post("/profile/edit", requireLogin, upload.single("profilePicture"), async (req, res) => {
    try {
        if (req.file) {
            const user = await User.findById(req.user._id || req.user.id);
            user.profilePicture = "/uploads/" + req.file.filename;
            await user.save();
        }
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.redirect("/dashboard");
    }
});

router.get("/login", (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("login", { error: null });
});

router.get("/signup", (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("signup", { error: null });
});

router.get("/about", (req, res) => res.render("about", { user: req.user }));
router.get("/contact", (req, res) => res.render("contact", { user: req.user }));
router.get("/jee", (req, res) => res.render("jee", { user: req.user }));
router.get("/gate", (req, res) => res.render("gate", { user: req.user }));
router.get("/quiz", (req, res) => res.render("quiz", { user: req.user }));
router.get("/computer_courses", (req, res) => res.render("computer_courses", { user: req.user }));
router.get("/history", (req, res) => res.render("history", { user: req.user }));

module.exports = router;
