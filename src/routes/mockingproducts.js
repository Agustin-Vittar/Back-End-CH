import { Router } from "express";
import { generateProductErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/custom-error.js";

export const mockingproductsrouter = Router();

const generateRandomId = () => Math.random().toString(36).substring(2, 9);

const generateRandomCode = () => Math.floor(Math.random() * 100000);

const generateRandomPrice = () => parseFloat((Math.random() * 1000).toFixed(2));

const generateMockProducts = () => {
  const mockProducts = [];

  for (let i = 0; i < 100; i++) {
    mockProducts.push({
      _id: generateRandomId(),
      title: `Product ${i + 1}`,
      description: `Description for product ${i + 1}`,
      code: generateRandomCode(),
      price: generateRandomPrice(),
      status: Math.random() < 0.5,
      stock: Math.floor(Math.random() * 100),
      category: `Category ${i % 5}`,
      thumbnail: [],
    });
  }

  return mockProducts;
};

let products = generateMockProducts(); // Generar los productos al inicio

mockingproductsrouter.get("/", (req, res) => {
  res.send({ status: "Success", payload: products });
});

mockingproductsrouter.post("/", (req, res) => {
  const { _id, title, description, code, price, status, category } = req.body;
  if (
    !_id ||
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !category
  ) {
    CustomError.createError({
      name: "Product creation error",
      cause: generateProductErrorInfo({
        _id,
        title,
        description,
        code,
        price,
        status,
        category,
      }),
      message: "Error trying to create a product",
      code: EErrors.PRODUCT_CREATION_ERROR,
    });
  }

  const newProduct = {
    _id: generateRandomId(),
    title: req.body.title,
    description: req.body.description,
    code: generateRandomCode(),
    price: req.body.price,
    status: req.body.status,
    stock: req.body.stock,
    category: req.body.category,
    thumbnail: req.body.thumbnail || [],
  };

  products.push(newProduct);

  res.send({ status: "Success", payload: newProduct });
});
