import nodemailer from 'nodemailer';
import config from '../config/config.js'

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.nodemailer_user,
        pass: config.nodemailer_password
    },
    tls: {
        rejectUnauthorized: false
    }
})