import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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
  code: {
    type: String,
    require:true
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
  },
  status: {
    type: Boolean,
    default: true
  }
});

productsSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model("Products", productsSchema);