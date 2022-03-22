import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    username: {
      type: String,
    },
    lastMessage: {
      message: {
        type: String,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
