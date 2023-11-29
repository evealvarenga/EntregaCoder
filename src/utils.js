import { dirname } from "path";
import { fileURLToPath } from "url";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

export const __dirname= dirname(fileURLToPath(import.meta.url))
export const hashData = async(data) =>{
    return bcrypt.hash(data,10)
}

//BCRYPT
export const compareData = async(data,hashData) =>{
    return bcrypt.compare(data,hashData) //retorna true o false
}

//JWT
const SECRET_KEY_JWT= "secretJWT"
export const generateToken = (user) =>{
    const token = Jwt.sign(user, SECRET_KEY_JWT, {expiresIn: 300});
    return token;
}