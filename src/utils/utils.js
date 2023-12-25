import { dirname, join } from "path";
import { fileURLToPath } from "url";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

export const __dirname= join(dirname(fileURLToPath(import.meta.url)), "../")
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
    const token = Jwt.sign(user, SECRET_KEY_JWT, {expiresIn: 300000});
    //console.log("token:",token);
    return token;
}

//Código único
export const generateUniqueCode = () => {
    const prefix = 'ORDER';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5); 
    const uniqueCode = `${prefix}-${timestamp}-${random}`;
    return uniqueCode.toUpperCase();
}