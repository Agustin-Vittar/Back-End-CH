import { Router } from "express";
import express from "express";
import { ProductManager } from "../productManager.js";

export const productRouter = Router();
const productManager = new ProductManager();

productRouter.use(express.json());
productRouter.use(express.urlencoded({ extended: true }));

productRouter.get("/", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    const limit = req.query.limit;

    if (!limit) {
      res.status(200).send({ status: "Success", data: allProducts });
    } else if (isNaN(limit)) {
      res
        .status(400)
        .send({ status: "Error", data: "Limit should be a number" });
    } else if (limit > 0 && limit <= allProducts.length) {
      let productsLimited = allProducts.slice(0, limit);
      res.status(200).send({ status: "Success", data: productsLimited });
    } else {
      res.status(400).send({
        status: "Error",
        data: "The limit entered is incorrect or exceeds the number of products",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "Error",
      data: "An error occurred while retrieving products",
    });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const productId = await productManager.getProductById(
      Number(req.params.pid)
    );
    res.status(200).json({ status: "Success", data: productId });
  } catch (error) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  const { key, value } = req.body;

  try {
    const result = await productManager.updateProduct(productId, key, value);
    res.status(200).json({ status: "Success", data: result });
  } catch (error) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});

productRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const result = await productManager.addProduct(newProduct);
    res.status(201).json({ status: "Success", data: result });
  } catch (err) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const productId = Number(req.params.productId);

  try {
    const result = await productManager.deleteProduct(productId);
    res.status(200).json({ status: "Success", data: result });
  } catch (err) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});
