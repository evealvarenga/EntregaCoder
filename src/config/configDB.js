import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import config from "./config.js"

const MONGO_URI = config.mongo_uri
mongoose
    .connect(MONGO_URI)
    .then(() => logger.info("Conectado a la base de datos"))
    .catch((error) => logger.info("No se pudo conectar a la base de datos.\n", error))