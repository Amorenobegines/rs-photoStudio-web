

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(expressLayouts); // Activar layouts
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

app.set('layout', 'layouts/layout'); // Layout por defecto
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/rs-photoStudio")
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log(err));

app.use("/", require("./routes/web"));
app.use("/admin", require("./routes/admin"));

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});


