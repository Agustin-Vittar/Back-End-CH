import { Schema, model } from "mongoose";

export const CartModel = model(
  "carts",
  new Schema({
    id: { type: Number, required: true },
    products: [
      {
        id: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  })
);
