import { UsersService } from "../service/users.service.js"
import { CustomError } from "../errors/errors.generator.js";
import { errorsMessages } from "../errors/errors.enum.js";


export const findUserById = async (id) => {
    const user = await UsersService.findById(id);
    if (!user) {
        CustomError.generateError(errorsMessages.USER_NOT_FOUND, 404)
        //return res.status(404).json({ message: "No User found with the id" });
    }
    return user
};

export const findUserByEmail = async (mail) => {
    const user = await UsersService.findByEmail(mail);
    if (!user) {
        CustomError.generateError(errorsMessages.USER_NOT_FOUND, 404)
        //return res.status(404).json({ message: "No User found with the id" });
    }
    return user
};

export const createUser = async (user) => {
    const { name, last_name, email, age, password } = user;
    if (!name || !last_name || !email || !password || !age) {
        console.log("Error")
        return "Error";
    }
    const createdUser = await UsersService.createOne(user);
    return createdUser;
};

export const updateUser = async (req, res) => {
    const { _id } = req.params;
    const { role } = req.body;
    try {        
    const userToUpdate = await UsersService.findById(_id);
    if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
    }
    if (userToUpdate._doc.email !== email ){
        return res.status(404).json({ message: "The information provided is incorrect" });
    }
    if (userToUpdate.role !== role) {
        const newUser = { ...userToUpdate._doc, role: role };
        const updatedUser = await UsersService.updateUser(uid, newUser);
        res.status(200).json({ message: "User updated", user: updatedUser });
        } else {
            res.status(402).json({ message: "Nothing has changed" });
            }
    }
    catch (error) {
            res.status(500).json({ message: error.message });
        }
} 