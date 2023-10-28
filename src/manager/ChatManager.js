import { messageModel } from "../db/models/chat.model";

class ChatManager {
    async findAll() {
        const result = await messageModel.find().lean();
        return result
    }

    async newOne(message) {
        const result = await messageModel.create(message);
        return result;
    }
}

export const chatManager = new ChatManager();