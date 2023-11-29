import Jwt  from "jsonwebtoken";
const SECRET_KEY_JWT = "secretJWT";

export const jwtValidation = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization')
        next()
    } catch (error) {
        res.json({error: error.message})
    }
}