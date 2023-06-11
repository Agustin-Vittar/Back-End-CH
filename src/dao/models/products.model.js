import { Schema, model } from "mongoose";

export const ProductModel = model(
  "products",
  new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: Array, required: true },
  })
);
