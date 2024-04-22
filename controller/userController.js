const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const passport = require('passport')

const User = require("../models/user")
const Message = require("../models/message");

const { genPassword, validPassport } = require("../lib/passwordUtils");

exports.signUpGET = (req, res, next) => {
    res.render("sign-up", {
        title: "Sign Up",
        url: req.url
    })
}

exports.signUpPOST = asyncHandler(async (req, res, next) => {

    const validationRules = [
        body('username')
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

    const { username, firstName, lastName, password } = req.body
    
    const user = new User({
        username, 
        firstName, 
        lastName, 
        password: generatePassword(password)
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
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('index', {
                title: "Message Board",
                error: info.message
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

exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}