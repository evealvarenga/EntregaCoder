import { ticketController } from "../DAL/daos/mongo/ticket.dao.js";
import config from "../config/config.js";
import Stripe from "stripe";

const STRIPE = config.stripe_secrey_key;
const StripeInstance = new Stripe(STRIPE);

export const createPaymentStripe = async (ticket) => {
    //const ticket = req.cookies.ticketId;
    const ticketDecod = ticketController.findById(ticket);
    const requestBody = {
        amount: ticketDecod.amount,
        currency: 'usd'
    }
    const response = await StripeInstance.PaymentIntent.create(requestBody);
    return response
} 