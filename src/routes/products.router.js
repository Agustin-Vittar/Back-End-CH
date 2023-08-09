import { Router } from "express";
import express from "express";
import faker from "faker";

//import { ProductManager } from "../productManager.js";
import { ProductController } from "../controller/products-controller.js";

export const productRouter = Router();
//const productManager = new ProductManager();
const productController = new ProductController();

productRouter.use(express.json());
productRouter.use(express.urlencoded({ extended: true }));

productRouter.get("/", productController.getAllProducts);

productRouter.get("/:pid", productController.getProductByID);

productRouter.put("/:pid", productController.updateProduct);

productRouter.post("/", productController.createProduct);

productRouter.delete("/:pid", productController.deleteProduct);

/* const numObjects = 8; // Número de objetos aleatorios a generar
const randomCode = faker.random.number({ min: 10000, max: 99999 });
const randomObjects = [];
for (let i = 0; i < numObjects; i++) {
  const randomObject = {
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    code: randomCode,
    price: faker.commerce.price(),
    status: faker.random.boolean(),
    stock: faker.random.number(),
    category: faker.commerce.department(),
    thumbnail: [
      faker.image.imageUrl(),
      faker.image.imageUrl(),
      faker.image.imageUrl(),
    ],
  };
  randomObjects.push(randomObject);
}

// Guarda los objetos aleatorios en la base de datos utilizando Mongoose
ProductModel.insertMany(randomObjects)
  .then((savedObjects) => {
    console.log(savedObjects);
  })
  .catch((error) => {
    console.error(error);
  }); */

/* 

productRouter.get("/", async (req, res) => {
  try {
    const allProducts = await productService.getAllProducts();
    const limite = req.query.limite;

    if (!limite) {
      res.status(200).send({ status: "Success", data: allProducts });
    } else if (isNaN(limite)) {
      res
        .status(400)
        .send({ status: "Error", data: "Limit should be a number" });
    } else if (limite > 0 && limite <= allProducts.length) {
      let productsLimited = allProducts.slice(0, limite);
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
  const updates = req.body;

  try {
    const result = await productManager.updateProduct(productId, updates);
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
    res.status(400).json({ status: "Error", data: err.message });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  try {
    const result = await productManager.deleteProduct(productId);
    res.status(200).json({ status: "Success", data: result });
  } catch (error) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});
 */
