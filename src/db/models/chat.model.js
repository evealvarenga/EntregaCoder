import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    }
})

export const messageModel = mongoose.model("messages", messagesSchema)