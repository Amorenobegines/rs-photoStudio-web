const express = require("express");
const router = express.Router();

const { isAdmin } = require('../middlewares/roles');

router.get('/admin', isAdmin, (req, res) => {
    res.send("Panel de admin");
});



module.exports = router;
