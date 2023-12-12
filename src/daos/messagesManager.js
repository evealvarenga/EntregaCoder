import { messageModel } from "../db/models/messages.model.js";

class MessageManager {
    async findAllMessage() {
        const response = await messageModel.find();
        return response;
    };


    async findByIdMessage(id) {
        const response = await messageModel.findById(id);
        return response;
    };

    async createOneMessage(obj) {
        const response = await messageModel.create(obj);
        return response;
    };

    async deleteOneMessage(id) {
        const response = await messageModel.deleteOne({ _id: id });
        return response;
    };
}

export const MessagesManager = new MessageManager()