import BasicMongo from "./basic.dao.js";
import { usersModel } from "../../models/users.model.js";

class UsersManager extends BasicMongo{
    constructor(){
        super(usersModel)
    }

    async findByEmail(email) {
        const response = await usersModel.findOne({ email });
        return response;
    };
}

export const usersManager = new UsersManager()