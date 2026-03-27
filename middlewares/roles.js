

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    return res.status(403).send("No autorizado");
};

module.exports = {
    isAuthenticated,
    isAdmin
};