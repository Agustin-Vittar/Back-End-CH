import { Router } from "express";
import express from "express";
import { CartManager } from "../cartManager.js";

export const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.use(express.json());
cartsRouter.use(express.urlencoded({ extended: true }));

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.generateCart();
    res.status(201).json({ status: "Success", data: newCart });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const cartProducts = await cartManager.getCartID(cartId);
    res.status(200).json({ status: "Success", data: cartProducts });
  } catch (error) {
    res.status(404).json({ status: "Error", error: "Cart not found" });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const addedProduct = await cartManager.addProductsCart(cartId, productId);
    res.status(200).json({ status: "Success", data: addedProduct });
  } catch (error) {
    res.status(404).json({ status: "Error", error: error.message });
  }
});
