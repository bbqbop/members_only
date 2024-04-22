const asyncHandler = require("express-async-handler")

const Message = require("../modules/message");
const User = require("../modules/user");


exports.index = asyncHandler(async (req, res, next) => {
    const messages = await Message
        .find()
        .sort({date: -1})
        .populate("author");
    res.render("message-board", {
        title: "Message Board",
        messages
    })
})

exports.newMessage = asyncHandler(async (req, res, next) => {
    if (req.body.message == 'Make me a member!') {
        await User.findByIdAndUpdate(req.user._id, { isMember: true })
        res.redirect("/")
    }
    if (req.body.message == 'Make me an admin!') {
        await User.findByIdAndUpdate(req.user._id, { isAdmin: true })
        res.redirect("/")
    }
    else {
        await new Message({
            message: req.body.message, 
            author: req.user._id,
        }).save()
        res.redirect("/")
    }
})

exports.deleteMessage = asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
})