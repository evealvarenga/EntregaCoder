import BasicMongo from "./basic.dao.js";
import { messageModel } from "../../models/messages.model.js";

class ChatManager extends BasicMongo{
    constructor(){
        super(messageModel)
    }
}

export const chatManager = new ChatManager()