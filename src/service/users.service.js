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

    async findByEmail(id) {
        const user = usersManager.findByEmail(id);
        return user;
    }

    async updateUser(id, obj) {
        const userNew = usersManager.updateOne(id, obj);
        return userNew;
    }

    async saveUserDocuments(id, dni, address, bank) {
        const obj = {
            documents: [
                ...(dni ? [{
                    name: "DNI",
                    reference: dni[0].path
                }] : []),
                ...(address ? [{
                    name: "address",
                    reference: address[0].path
                }] : []),
                ...(bank ? [{
                    name: "bank",
                    reference: bank[0].path
                }] : []),
            ]
        }
        console.log(obj);
        const saveDocs = usersManager.updateOne(id, obj);
        return saveDocs 
    }
}

export const UsersService = new UserService()