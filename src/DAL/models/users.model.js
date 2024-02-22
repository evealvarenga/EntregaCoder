import mongoose, { Schema, model } from "mongoose";

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
    isGithub: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER", "PREMIUM"],
        default: "USER"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    documents: [{
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []

    }],
    last_connection: {
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ["NULL", "DNI_OK", "BANK_OK", "ADDRESS_OK", "ALL_OK", "DNI_ADDRESS_OK"],
        default: "NULL"
    }
});

const usersModel = model("Users", usersSchema);
export { usersModel };