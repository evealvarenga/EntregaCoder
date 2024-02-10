import mongoose from "mongoose";
import config from "../src/config/config.js"

const MONGO_URI = config.mongo_uri
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log("No se pudo conectar a la base de datos.\n", error))