const User = require('./user.model');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const findOrCreateGoogleUser = async (profile) => {
    const email = profile.emails[0].value;

    let user = await User.findOne({ email });

    // asignar rol dinámicamente
    const role = email === ADMIN_EMAIL ? "admin" : "user";

    if (!user) {
        user = new User({
            email,
            googleId: profile.id,
            role
        });
        await user.save();
    } else {
        // importante si cambias el ADMIN_EMAIL en el futuro
        user.role = role;
        await user.save();
    }

    return user;
};

const users = await User.find();
console.log(users);

module.exports = {
    findOrCreateGoogleUser
};