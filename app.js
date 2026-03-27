require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Passport config
require("./config/passport");

// Middlewares
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Views
app.set('layout', 'layouts/layout');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static
app.use(express.static(path.join(__dirname, "public")));

// Routes
const webRoutes = require("./routes/web");
const adminRoutes = require("./routes/admin");

app.use("/", webRoutes);
app.use("/admin", adminRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});