import { usersManager } from "../DAL/daos/mongo/users.dao.js";
import { hashData } from "../utils/utils.js";
import { cartsModel } from "../DAL/models/carts.model.js";


class UserService {
    async findById(id) {
        const user = await usersManager.getById(id);
        return user;
    }

    async createOne(obj) {
        const hashedPassword = await hashData(obj.password);
        const createCart = new cartsModel();
        await createCart.save();
        const newObj = ({ ...obj, password: hashedPassword, cart: createCart._id });
        const newUser = await usersManager.createOne(newObj)
        return newUser
    }

    async findByEmail(id){
        return usersManager.findByEmail(id)
    }
}

export const UsersService = new UserService()