import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "./utils.js"
import { join } from "path"

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title:"Entrega-CODER API",
            version: "1.0.0",
            description: "Proyecto coder house - Alvarenga"
        },
    },
    apis: [join(__dirname, "docs", "*.yaml")]
};
 
export const swaggerSetup = swaggerJSDoc(swaggerOptions)