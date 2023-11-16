import { Schema, model} from "mongoose";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    last_name: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },

    isGithub:{
        type: Boolean,
        default: false
    }
});

const usersModel = model("Users", usersSchema);
export { usersModel };