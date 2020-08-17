var LocalStrategy = require('passport-local').Strategy;
var User = require('./../models/user');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({
            email: email
        }, function (err, user) {
            if (err)
                console.log(err);

            if (!user) {
                return done(null, false, {
                    message: 'Email is not registered'
                });
            }
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err)
                    console.log(err);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Password Incorrect'
                    });
                }
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}