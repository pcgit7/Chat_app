const router = require("express").Router();
const Chat = require('../Models/chatModel');
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/send-message", authMiddleware, async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const saveMessage = await newMessage.save();

    await Chat.findOneAndUpdate(
        { _id: req.body.chat },
        {
          lastMessage: saveMessage._id,
          $inc: { unreadMessages: 1 },
        }
      );
  
      res.send({
        success: true,
        message: "Message sent successfully",
        data: saveMessage,
      });
    } catch (error) {
      res.send({
        success: false,
        message: "Error sending message",
        error: error.message,
      });
    }
  });

router.get('/get-all-messages/:chatId' , authMiddleware, async(req,res) => {
    try {
        const messages = await Message.find({
          chat: req.params.chatId,
        }).sort({ createdAt: 1 });
        res.send({
          success: true,
          message: "Messages fetched successfully",
          data: messages,
        });
      } catch (error) {
        res.send({
          success: false,
          message: "Error fetching messages",
          error: error.message,
        });
      }
});

module.exports = router;