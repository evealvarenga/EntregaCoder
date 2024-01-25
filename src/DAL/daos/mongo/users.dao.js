import BasicMongo from "./basic.dao.js";
import { usersModel } from "../../models/users.model.js";

class UsersManager extends BasicMongo{
    constructor(){
        super(usersModel)
    }

    async findByEmail(email) {
        return await usersModel.findOne({ email })
    };

    async updateOne(id, obj) {
        const result = await usersModel.updateOne({ _id: id }, obj);
        return result;
    };
}

export const usersManager = new UsersManager()