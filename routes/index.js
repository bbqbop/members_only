var express = require('express');
var router = express.Router();

const userController = require("../controller/userController")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: "Message Board"
  });
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up", {
    title: "Sign-Up"
  })
})

router.post("/sign-up", userController.signUp)
router.post("/login", userController.logIn)

module.exports = router;
