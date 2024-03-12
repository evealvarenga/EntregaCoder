import { createPaymentStripe } from "../service/payments.service.js"

export const createdPayment = async (req, res) => {
    try {
        const payment = await createPaymentStripe(ticket)
        res.json({message:"Payment", payload: payment})
    } catch (error) {
        res.json({message: error})
    }
}