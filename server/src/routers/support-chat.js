import express from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import mongoose from "mongoose";
import Message from "../models/messages.js";
import Chat from "../models/chat.js";

const router = new express.Router();
let db = mongoose.connection;


router.get('/support-chat', userAuth, async (req, res) => {
  let chatArray = [];
  if (req.user.role === "admin") {
    chatArray = await Chat.find({})
  } else {
    const userChatId = await req.user.getChatId()
    const userChat = await Chat.findById(userChatId)
    chatArray = [userChat]
  }
    res.render('supportChat', { 
    id: req.user._id,
    isAdmin: req.user.role === "admin",

    chats: JSON.stringify(chatArray),
     

    bracesStart: "{{",
      bracesEnd: "}}",
      endLoop: "/",
      startLoop: "#"
    })

    router.get('/support-chat/:id', userAuth, async (req, res) => {
      if (req.user.role != "admin" && req.user.chatId != req.params.id) {
        return res.send([])
      }
      let messagesArray = []
      messagesArray = await Message.find({ chatId: req.params.id })
      res.send(messagesArray)
    })

  })





export default router