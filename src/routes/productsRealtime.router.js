import { ProductManager } from "../dao/productManager.js";
import { Router } from "express";
import express from "express";
import { authorizeUser } from "../dao/middlewares/auth.js";

export const productController = Router();
const productManager = new ProductManager();

productController.use(express.json());
productController.use(express.urlencoded({ extended: true }));

productController.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    return res.render("home", { products: products });
  } catch (error) {
    return res.status(500).json({ status: "Error", data: error.message });
  }
});

productController.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {});
});

productController.get("/chat", authorizeUser, (req, res) => {
  res.render("chat", {});
});
