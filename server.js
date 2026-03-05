const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");

// THIS LINE IS IMPORTANT
app.use(express.static("public"));

// routes
app.get("/", (req,res)=>{
    res.render("index");
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

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.redirect("/");
    } else {
        res.send("Invalid username or password");
    }

});
app.post("/signup", (req, res) => {

    const { username, email, password } = req.body;

    let users = JSON.parse(fs.readFileSync("users.json"));

    users.push({
        username,
        email,
        password
    });

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.redirect("/login");

});
app.listen(3000,()=>{
    console.log("Server running on port 3000");
});