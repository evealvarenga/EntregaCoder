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
    const { _id } = req.params;
    const { role } = req.body;

    const userToUpdate = await UsersService.findById(_id);

    if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const control = userToUpdate.documents
        const DNI = control.find((item) => item.name === 'DNI')
        const address = control.find((item) => item.name === 'address')
        const bank = control.find((item) => item.name === 'bank')
        if (userToUpdate.role === "USER") {
            if (!DNI || !address || !bank) {
                return res.status(400).json({ message: "All documents are required" });
            } else {
                await UsersService.updateUser(_id, role);
                return res.status(200).json({ message: "User update" });
            }
        }
        await UsersService.updateUser(_id, role);
        res.status(200).json({ message: "User update" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const userDocuments = async (req, res) => {
    const { id } = req.params
    const { DNI, address, bank } = req.files
    if (DNI && address) {
        UsersService.updateUser(id, { status: "DNI_ADDRESS_OK" });
    } else {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (DNI && address && bank) {
        UsersService.updateUser(id, { status: "ALL_OK" });
    }
    const response = await saveUserDocumentsServ({ id, DNI, address, bank })
    res.json({ response })
};