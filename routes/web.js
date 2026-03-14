const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const posts = require("../data/posts");
router.get("/", (req, res) => {
    res.render("web/inicio");
});
router.get("/portfolio", (req, res) => {
    res.render("web/portfolio");
});


router.get("/about", (req, res) => {
    res.render("web/about");
});


router.get("/services", (req, res) => {
    res.render("web/services");
});


router.get("/contacto", (req, res) => {
    res.render("web/contacto");
});
router.get('/blog', (req, res) => {
    res.render('web/blog', { posts });
});


router.get("/blog/:slug", (req, res) => {
    const post = posts.find(p => p.slug === req.params.slug);
    if (!post) return res.status(404).render("web/404", { message: "Artículo no encontrado" });
    res.render('blog/post', { post });
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
