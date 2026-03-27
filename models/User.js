const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null // para usuarios de Google
    },
    googleId: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);