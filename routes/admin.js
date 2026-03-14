const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Panel de administración funcionando");
});

module.exports = router;
