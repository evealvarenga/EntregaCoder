import nodemailer from 'nodemailer';
import config from '../config/config.js'

const NodeUser = config.nodemailer_user
const NodePass = config.nodemailer_password

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: NodeUser,
        pass: NodePass
    }
})