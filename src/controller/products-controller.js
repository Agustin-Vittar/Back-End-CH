import { ProductManager } from "../productManager.js";
import { Router } from "express";
import express from "express";

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
