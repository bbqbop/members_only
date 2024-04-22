const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
const verifyPassword = require("../lib/passwordUtils").verifyPassword

const strategy = new LocalStrategy(async (username, password, done) => {
    
    User.findOne({ username: username })
        .then(user => {

            if (!user) return done(null, false)

            const isValid = verifyPassword(password, user.password);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            done(err);
        });

    
    
    // try {
    //     const user = await User.findOne({ username: username });
    //     if (!user) {
    //         return done(null, false, { message: "Incorrect username" });
    //     };
    //     const match = await bcrypt.compare(password, user.password);
    //     if (!match) {
    //         return done(null, false, { message: "Incorrect password" });
    //     }
    //     return done(null, user);
    // } catch (err) {
    //     return done(err)
    // }
});

passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then(user => {
            done(null, user);
        })
        .catch(err => done(err))
});

