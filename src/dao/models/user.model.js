import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: {
    type: String,
    max: 100,
  },
  lastName: {
    type: String,
    max: 100,
  },
  password: {
    type: String,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  age: {
    type: Number,
    max: 100,
  },
  cart: {
    type: String,
  },
});

export const UserModel = model("users", schema);
