const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("./../models/User");

function initPassport(passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) {
        return done(err);
      }

      done(null, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
  }, async function (email, password, done) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        done(null, user);
      } else {
        done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      done(err);
    }
  }));
}

module.exports = initPassport;
