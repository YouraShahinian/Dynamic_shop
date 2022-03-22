import jwt from "jsonwebtoken";
import Message from "../models/messages.js";
import User from "../models/user.js";

// Socket.io
const importIo = (io) => {
  io.on("connection", async (socket) => {
    console.log("New WebSocket connection");

    let user;

    try {
      let token;
      let arrCookie = socket.handshake.headers.cookie.match(
        new RegExp("(^| )" + "access_token" + "=([^;]+)")
      );
      token = arrCookie == null ? null : arrCookie[2];
      if (!token) throw new Error("Incorrect token!");

      const decoded = jwt.verify(token, "dynamicshop");
      user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      }).orFail(new Error("no user!"));
      socket.join(await user.getChatId());
    } catch (e) {
      console.log(e);
      socket.disconnect();
      return;
    }

    socket.on("sendMessage", async (message, callback) => {
      let savedMessage;
      try {
        if (!user.isAdmin()) {
          message.chatId = await user.getChatId();
        }
        savedMessage = new Message({
          message: message.text,
          chatId: message.chatId ? message.chatId : user.chatId,
          isAdmin: user.isAdmin(),
        });
        await savedMessage.save();
      } catch (e) {
        console.log(e);
        return;
      }
      let username = null;
      if (!user.isAdmin()) {
        username = user.name;
      } else {
        username = "admin";
      }
      io.to("admin").emit("message", {
        username,
        chatId: message.chatId,
        text: message.text,
        createdAt: savedMessage.createdAt,
        isAdmin: user.isAdmin(),
      });
      io.to(message.chatId).emit("message", {
        username,
        chatId: message.chatId,
        text: message.text,
        createdAt: savedMessage.createdAt,
        isAdmin: user.isAdmin(),
      });
      callback();
    });

    socket.on("disconnect", () => {
      console.log(`disconnected user: ${user.username}`);
    });
  });
  return io;
};

export default importIo;
