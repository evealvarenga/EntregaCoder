import { usersManager } from "../daos/usersManager.js";
import { hashData } from "../utils.js";



export const findById = (id) => {
    const user = usersManager.findById(id);
    return user;
};

export const findByEmail = (id) => {
    const user = usersManager.findByEmail(id);
    return user;
};

export const createOne = (obj) => {
    const hashedPassword = hashData(obj.password);
    const newObj = { ...obj, password: hashedPassword };
    const createdUser = usersManager.createOne(newObj);
    return createdUser;
};