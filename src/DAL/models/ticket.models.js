import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        require: true,
    },
    purchase_datatime: {
        type: Date,
        required: true
    },
    amount: { 
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true,
    }
});

const ticketModel = model("Ticket", ticketSchema);
export { ticketModel };