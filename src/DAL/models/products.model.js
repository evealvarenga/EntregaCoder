import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    code: {

        type: String,
        required: true,
        unique: true,
    },
    stock: {

        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    thumbnails: {
        type: String,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: "ADMIN"
    }

});

productsSchema.plugin(mongoosePaginate);


const productsModel = model("Products", productsSchema);
export { productsModel };