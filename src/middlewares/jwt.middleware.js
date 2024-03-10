import jwt from "jsonwebtoken";
import config from "../config/config.js"
import passport from "passport";
import { UsersService } from "../service/users.service.js"
import { generateToken } from "../utils/utils.js";


const secretKeyJwt = config.secret_jwt;

export const jwtValidation = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const userToken = jwt.verify(token, secretKeyJwt);
        req.user = userToken;
        next();
    } catch (error) {
        res.json({ error: error.message });
    }
};

export const tokenValidation = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user) => {
        if (err || !user) {
            return res.json({ message: "user no logeado" })
        }
        req.user = user;
        return next();
    })(req, res, next);
}

export const tokenMiddleware = (req, res, next) => {
    const { name, last_name, email, role, _id } = req.user
    const token = generateToken({
        name,
        last_name,
        email,
        role,
        _id
    });
    if (token) {
        UsersService.updateUser(_id, { last_connection: new Date() });
    }
    res.cookie("token", token, { maxAge: 60000, httpOnly: true })
    next()
}