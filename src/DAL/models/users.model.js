import mongoose, { Schema, model} from "mongoose";

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
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
    },
    isGithub:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum: [ "ADMIN", "USER"],
        default: "USER"
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    }
});

const usersModel = model("Users", usersSchema);
export { usersModel };