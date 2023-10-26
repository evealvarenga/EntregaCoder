import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: Number,
  },
  stock: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
  }
});

export const productsModel = mongoose.model("Products", productsSchema);