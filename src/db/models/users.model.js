import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        index: true,
      },
      password: {
        type: String,
        required: true
      }
})

usersSchema.plugin(mongoosePaginate);

export const usersModel = mongoose.model("Users", usersSchema);