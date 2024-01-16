import winston from "winston";
import config from "./config/config.js"

const ENVIRONMENT = config.environment;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },

    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "green"
    }
}

let logger

//Development
if (ENVIRONMENT === "development") {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple()
                )
            }),
        ]
    })
} else {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                level: "error",
                filename: "error.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                )
            })
        ]
    })
}

//Producción
if (ENVIRONMENT === "production") {
    logger = winston.createLogger({
       levels: customLevels.levels,
       transports:[
           new winston.transports.Console({
               level: "info",
               format: winston.format.combine(
                   winston.format.colorize({colors: customLevels.colors}),
                    winston.format.simple()
               )
           }),
           new winston.transports.File({
               level: "error",
               filename:"error.log",
               format: winston.format.combine(
                   winston.format.colorize({colors: customLevels.colors}),
                    winston.format.simple()
               )
           })
       ]
   })
}

export { logger }