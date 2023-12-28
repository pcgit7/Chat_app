const router = require("express").Router();
const Chat = require("../models/chatModel");
const Message = require("../Models/messageModel");
const authMiddleware = require("../middlewares/authMiddleware");

// create a new chat
router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    console.log("hi");
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();

    // populate members and last message in saved chat
    await savedChat.populate("members");
    res.send({
      success: true,
      message: "Chat created successfully",
      data: savedChat,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
});

// get all chats of current user

router.get("/get-all-chats", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({
      members: {
        $in: [req.body.userId],
      },
    });
      
    res.send({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error fetching chats",
      error: error.message,
    });
  }
});


router.delete('/delete-all-chats' , async(req,res) => {
  try {
    const response = await Chat.deleteMany();
  return res.json("deleted");
  } catch (error) {
    return res.send("error");
  }
  
})
module.exports = router;


