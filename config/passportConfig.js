const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt")

const User = require("../modules/user");

const passportStrategy = new LocalStrategy(async (userName, password, done) => {
    try {
        console.log('here')
        const user = await User.findOne({ userName: userName });
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err)
    }
});

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);

        done(null, user);
    } catch(err) {
        done(err);
    }
  })


module.exports = passportStrategy;