require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const connectDB = require("./config/db");
const { authenticateJWT } = require("./middleware/auth");

// Connect to MongoDB
connectDB();

// ─── Middleware ───────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Initialize Passport (No sessions used)
app.use(passport.initialize());

// Globally apply JWT authentication so `req.user` is available in all views
app.use(authenticateJWT);

// ─── Routes ───────────────────────────────────────────────────
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));