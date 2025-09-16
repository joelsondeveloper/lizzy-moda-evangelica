const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });
        if (user) {
            user.name = profile.displayName;

            if (!user.isVerified) {
                user.isVerified = true;
                user.verificationCode = null;
                user.codeExpiresAt = null;
            }

            await user.save();
            const token = generateToken(user._id);
            done(null, { user, token });
        } else {
            const newUser = await User.create({
                name: profile.displayName,
                email,
                password: 'GoogleLoginNoPasswordSet' + new Date().getTime(),
                isVerified: true,
                isAdmin: false,
                verificationCode: null,
                codeExpiresAt: null,
            });
            const token = generateToken(newUser._id);
            done(null, { user: newUser, token });
        }

    } catch (error) {
        console.error('Erro ao autenticar com Google:', error);
        done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;