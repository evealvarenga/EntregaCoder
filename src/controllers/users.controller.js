import { UsersService } from "../service/users.service.js"


export const findUserById = async (id) => {
    const user = await UsersService.findById(id);
    if (!user) {
        return res.status(404).json({ message: "No User found with the id" });
    }
    return user
};

export const findUserByEmail = async (mail) => {
    const user = await UsersService.findByEmail(mail);
    if (!user) {
        return res.status(404).json({ message: "No User found with the id" });
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