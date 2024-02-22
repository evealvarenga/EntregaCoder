import multer from "multer";
import { __dirname } from "../utils/utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === 'profiles'){
            return cb(null, `${__dirname}/files/profiles`)
        } else if(file.fieldname === 'products'){
            return cb(null, `${__dirname}/files/products`)
        } else {
            return cb(null, `${__dirname}/files/documents`)
        }
        
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

export default upload;