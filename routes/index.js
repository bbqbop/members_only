var express = require('express');
var router = express.Router();

const messageController = require("../controller/messageController")
const userController = require("../controller/userController")

/* GET home page. */
router.get('/', messageController.index)

router.get("/sign-up", userController.signUpGET)
router.post("/sign-up", userController.signUpPOST)
router.post("/login", userController.logIn)
router.get("/logout", userController.logOut)
router.post("/new-message", messageController.newMessage)
router.get("/delete-message/:id", messageController.deleteMessage)

module.exports = router;
