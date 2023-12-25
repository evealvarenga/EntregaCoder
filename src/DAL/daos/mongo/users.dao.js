import BasicMongo from "./basic.dao.js";
import { usersModel } from "../../models/users.model.js";

class UsersManager extends BasicMongo{
    constructor(){
        super(usersModel)
    }

    async findByEmail(email) {
        return await usersModel.findOne({ email })
    };
}

export const usersManager = new UsersManager()