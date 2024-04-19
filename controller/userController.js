const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const passport = require('passport')

const User = require("../modules/user")

exports.signUp = asyncHandler(async (req, res, next) => {

    const validationRules = [
        body('userName')
            .trim()
            .toLowerCase()
            .isLength({ min: 1 })
            .withMessage('User name must not be empty.')
            .isAlphanumeric()
            .withMessage('User name must only contain Letters and numbers')
            .escape(),
        body('firstName')
            .trim()
            .isLength({ min: 1 })
            .withMessage('First name must not be empty.')
            .isAlpha()
            .withMessage('First name must only contain Letters')
            .escape(),
        body('lastName')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Last name must not be empty.')
            .isAlpha()
            .withMessage('Last name must only contain Letters')
            .escape(),
        body('password')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Password must not be empty')
            .escape(),
        body('confirmPassword')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Password must not be empty')
            .escape()
            .custom((value, {req}) => value === req.body.password)
            .withMessage("The passwords don't match.")
    ];

    await Promise.all(validationRules.map(rule => rule.run(req)));
    const validationErrors = validationResult(req);

    const { userName, firstName, lastName, password } = req.body

    const hash = await bcrypt.hash(password, 10)
    
    const user = new User({
        userName, firstName, lastName, password: hash
    })

    if (!validationErrors.isEmpty()) {
        res.render("sign-up", {
            title: "Sign-Up",
            user,
            errors: validationErrors.array()
        });
    } else {
        await user.save()
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        }) 
       }
})

exports.logIn = (req, res, next) => {
    console.log('LOGIN')
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log(err)
            return next(err);
        }
        if (!user) {
            return res.render('index', {
                error: info.message // Use info.message for error message
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
}

