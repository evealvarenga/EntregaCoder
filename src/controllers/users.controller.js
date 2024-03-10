import { UsersService } from "../service/users.service.js"
import { CustomError } from "../errors/errors.generator.js";
import { errorsMessages } from "../errors/errors.enum.js";
import { transporter } from "../utils/nodemailer.js"
import { mongoose } from "mongoose";
import { usersModel } from "../DAL/models/users.model.js";
import UsersResponseDto from "../DAL/dtos/users.response.dto.js"

export const findAllUser = async (req, res) => {
    try {
        const allUsers = await UsersService.findAll()
        const usersMap = users.map(user => UsersResponseDto.fromModel(user))
        res.status(200).json({ message: "Users:", usersMap });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const findUserById = async (id) => {
    const user = await UsersService.findById(id);
    if (!user) {
        CustomError.generateError(errorsMessages.USER_NOT_FOUND, 404)
        //return res.status(404).json({ message: "No User found with the id" });
    }
    return user
};

export const findUserByEmail = async (mail, req, res) => {
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
    const { _id } = req.body;
    const { role } = req.body 
    const userToUpdate = await UsersService.findById(_id);

    if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
    }
    try {       
        if (userToUpdate.status === "NULL") {
            return res.status(400).json({ message: "Todos los documentos son necesarios." });
        } if (userToUpdate.status === "DNI_OK") {
            return res.status(400).json({ message: "Faltan datos de dirección y banco." });
        } if (userToUpdate.status === "BANK_OK") {
            return res.status(400).json({ message: "Faltan datos de dirección y DNI." });
        } if (userToUpdate.status === "ADDRESS_OK") {
            return res.status(400).json({ message: "Faltan datos de banco y DNI." });
        } if (userToUpdate.status === "DNI_ADDRESS_OK") {
            return res.status(400).json({ message: "Faltan datos bancarios." });
        } else {
            const newRole = {role: role}
            await UsersService.updateUser(_id, newRole);
            return res.status(200).json({ message: "User update" });
        }
        await UsersService.updateUser(_id, newRole);
        res.status(200).json({ message: "User update" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAdmin = async (req, res) => {
    const { userId } = req.params;
    const role = req.body
    const userID = await UsersService.findById(userId)
    if (!userID) {
        return CustomError.generateError(errorsMessages.USER_NOT_FOUND, 404)
    }
    try {
        await UsersService.updateUser(userId, role);
        res.status(200).json({ message: "User update" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const userDocuments = async (req, res) => {
    const { id } = await req.params
    const { DNI, address, bank } = await req.files
    if (DNI && address) {
        UsersService.updateUser(id, { status: "DNI_ADDRESS_OK" });
    } else {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (DNI && address && bank) {
        UsersService.updateUser(id, { status: "ALL_OK" });
    }
    const response = await UsersService.saveUserDocuments(id, DNI, address, bank)
    res.json({ response })
};

export const deleteInactiveUsers = async (req, res) => {
    const users = await findAllUserService()
    let limitDate = new Date()
    limitDate.setTime(limitDate.getTime() - (2 * 60 * 1000))
    const activeUsers = users.filter(item => item.last_connection.getTime() >= limitDate.getTime())
    const inactiveUsers = users.filter(item => item.last_connection.getTime() <= limitDate.getTime())
    inactiveUsers.forEach(item => {
        transporter.sendMail({
            from: "CODER-ENTREGA",
            to: item.email,
            subject: "Tu cuenta ha sido eliminada",
            html:
                `<p>Debido a la inactividad en tu cuenta, hemos decidido eliminar la misma.</p>`
        })
    });
    usersModel.deleteMany({ last_connection: { $lt: limitDate } }, (err) => {
        if (err) return console.error(err);
    });
    return res.status(400).json({ message: "YEEEES", activeUsers });
}