import BasicMongo from "./basic.dao.js";
import { ticketModel } from "../../models/ticket.models.js";

class TicketController extends BasicMongo{
    constructor(){
        super(ticketModel)
    }

    
}

export const ticketController = new TicketController()

