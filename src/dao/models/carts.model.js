import { Schema, Types, model } from "mongoose";

export const CartModel = model(
  "carts",
  new Schema({
<<<<<<< HEAD
    id: { type: Number, required: true },
=======
>>>>>>> 9460772 (Preentrega Nº 3)
    products: [
      {
        id: { type: Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  })
);
