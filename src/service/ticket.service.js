import { ticketController } from "../DAL/daos/mongo/ticket.dao.js";

export const findById = (id) => {
    const ticket = ticketController.getById(id);
    return ticket;
};

export const findByEmail = (id) => {
    const ticket = ticketController.findByEmail(id);
    return ticket;
};

export const createOne = (obj) => {
    const createdTicket = ticketController.createOne(obj);
    return createdTicket;
};