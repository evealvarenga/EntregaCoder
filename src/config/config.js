import dotenv from "dotenv";
dotenv.config();

const obj = {
    port : process.env.PORT,
    mongo_uri : process.env.MONGO_URI,
    secret_jwt : process.env.SECRET_KEY_JWT,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_password: process.env.NODEMAILER_PASSWORD,
    environment: process.env.ENVIRONMENT
};

export default obj;