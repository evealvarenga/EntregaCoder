import { findByEmail, findById, createOne } from "../service/ticket.service.js";
import { generateUniqueCode } from "../utils/utils.js";
import { findCartById } from "./cart.controller.js";
import { findAllProduct } from "./products.controller.js";


export const findticketById = async (req, res) => {
    const { tid } = req.params;
    try {
        const ticket = await findById(tid);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket found", ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const findticketByEmail = async (req, res) => {
    const { email } = req.user;
    try {
        const ticket = await findByEmail(email);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket found", ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const createOneTicket = async (obj) => {
    try {
        const ticket = await createOne(obj)
        return ticket
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}