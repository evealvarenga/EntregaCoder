import { Schema, model } from "mongoose";
import { mongoose } from "mongoose";

const cartsSchema = new Schema({

  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Products'
      },
      quantity: {
        type: Number
      },
      _id: false
    }
  ]
});

const cartsModel = model("Carts", cartsSchema);
export { cartsModel };