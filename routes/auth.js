const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const upload = require("../middleware/upload");

router.post("/signup", upload.single("profilePicture"), authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login", session: false }), 
    authController.googleCallback
);

module.exports = router;
