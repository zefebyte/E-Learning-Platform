const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const session = require("express-session");
app.use(session({
    secret: "elearning-secret",
    resave: false,
    saveUninitialized: true
}));

// EJS setup
app.set("view engine", "ejs");

// THIS LINE IS IMPORTANT
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {

    console.log("SESSION USER:", req.session.user);

    const user = req.session.user;

    res.render("index", { user });

});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/jee", (req, res) => {
    res.render("jee");
});

app.get("/gate", (req, res) => {
    res.render("gate");
});

app.get("/quiz", (req, res) => {
    res.render("quiz");
});

app.get("/computer_courses", (req, res) => {
    res.render("computer_courses");
});

app.get("/history", (req, res) => {
    res.render("history");
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync("users.json"));

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {

        // store user in session
        req.session.user = {
            username: user.username,
            email: user.email
        };

        // save session before redirect
        req.session.save(function(err) {
            if (err) {
                console.log(err);
                return res.send("Session error");
            }
            res.redirect("/");
        });

    } else {
        res.send("Invalid username or password");
    }

});
app.post("/signup", (req, res) => {

    const { username, email, password } = req.body;

    let users = JSON.parse(fs.readFileSync("users.json"));

    // check if email already exists
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        return res.send("Account with this email already exists");
    }

    users.push({
        username,
        email,
        password
    });

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.redirect("/login");

});
app.get("/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/login");

});
app.listen(3000,()=>{
    console.log("Server running on port 3000");
});