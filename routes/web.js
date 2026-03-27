const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const posts = require("../data/posts");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require('passport');
const { isAuthenticated, isAdmin } = require('../middlewares/roles');
router.get("/", (req, res) => {
    res.render("web/inicio");
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.json(req.user);
});


router.get("/register", (req, res) => {
    res.render("autentication/register", { error: null });
});

router.get("/login", (req, res) => {
    res.render("autentication/login", { error: null });
});

router.post("/register", async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.render("autentication/register", { error: "Todos los campos son obligatorios" });
    }

    if (password !== confirmPassword) {
        return res.render("autentication/register", { error: "Las contraseñas no coinciden" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.render("autentication/register", { error: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hash, role: "user" });
    await user.save();

    res.redirect("/login");
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.render("autentication/login", { error: "Usuario no existe" });
    }

    if (!user.password) {
        return res.render("autentication/login", {
            error: "Este usuario usa Google para iniciar sesión"
        });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
        return res.render("autentication/login", { error: "Contraseña incorrecta" });
    }
    res.send("Login correcto");
});

router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.redirect("/admin");
    }
);

router.get("/galeria", (req, res) => {
    res.render("web/portfolio");
});


router.get("/about", (req, res) => {
    res.render("web/about");
});


router.get("/services", (req, res) => {
    res.render("web/services");
});

router.get("/fotografia-navidad-Dos-Hermanas", (req, res) => {
    res.render("web/navidad");
});

router.get("/fotografia-comunion-Dos-Hermanas", (req, res) => {
    res.render("web/comunion");
});

router.get("/fotografia-newborn-dos-hermanas", (req, res) => {
    res.render("web/newborn");
});

router.get("/fotografia-familiar-dos-hermanas", (req, res) => {
    res.render("web/familiar");
});

router.get("/fotografia-eventos-dos-hermanas", (req, res) => {
    res.render("web/eventos");
});

router.get("/fotografia-bautizo-Dos-Hermanas", (req, res) => {
    res.render("web/bautizos");
});

router.get("/fotografia-embarazo-dos-hermanas", (req, res) => {
    res.render("web/maternidad");
});

router.get("/fotografia-smash-cake-dos-hermanas", (req, res) => {
    res.render("web/smaskcake");
});

router.get("/fotografia-infantil-dos-hermanas", (req, res) => {
    res.render("web/infantil");
});

router.get("/fotografia-seguimiento-dos-hermanas", (req, res) => {
    res.render("web/seguimiento");
});

router.get("/fotografia-pareja-dos-hermanas", (req, res) => {
    res.render("web/pareja");
});

router.get("/fotografia-pack-embarazo-newborn-dos-hermanas", (req, res) => {
    res.render("web/pack-embarazo-newborn");
});

router.get("/contacto", (req, res) => {
    res.render("web/contacto");
});




router.get('/blog', (req, res) => {
    res.render('web/blog', { posts });
});


router.get("/blog/:slug", (req, res) => {
    const post = posts.find(p => p.slug === req.params.slug);

    if (!post) {
        return res.status(404).send("Post no encontrado");
    }

    res.render("blog/blog-post", { post });
});

router.post("/contacto", async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ mensaje: "No se recibió un cuerpo válido", success: false });
    }
    const { nombre, email, telefono, sesion, conocido, mensaje } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"RS Photo Studio" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "Nueva solicitud de sesión - RS Photo Studio",
            html: `
        <h2>Nueva solicitud de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Sesión:</strong> ${sesion}</p> 
        <p><strong>¿Cómo nos has conocido?</strong> ${conocido}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ mensaje: "¡Mensaje enviado correctamente!", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Hubo un error al enviar el mensaje.", success: false });
    }
});




module.exports = router;
