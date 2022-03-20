import mongoose from 'mongoose'
import Chat from './chat.js'

const messagesSchema = new mongoose.Schema ({
    chatId: {
        type: String
    },
    message: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

messagesSchema.pre('save', async function(next) {
    const message = this
    try {
        const chat = await Chat.findById(this.chatId).orFail(new Error("No chat found."))
        chat.lastMessage = {
            message: message.message,
            isAdmin: message.isAdmin
        }
        await chat.save()
        next()
    } catch (e) {
        console.log(e)
        return
    }
})

const Message = mongoose.model('Message', messagesSchema)

export default Message