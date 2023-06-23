import { Router } from "express";
import express from "express";
import faker from "faker";

//import { ProductManager } from "../productManager.js";
import { ProductService } from "../services/products.service.js";
import { ProductModel } from "../dao/models/products.model.js";

export const productRouter = Router();
//const productManager = new ProductManager();
const productService = new ProductService();

productRouter.use(express.json());
productRouter.use(express.urlencoded({ extended: true }));

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

productRouter.get("/productos", async (req, res) => {
  const { limit, page, sort, query } = req.query;

  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
  };

  const searchOptions = query ? { category: query } : {};

  if (sort === "asc") {
    options.sort = { price: 1 };
  } else if (sort === "desc") {
    options.sort = { price: -1 };
  }

  try {
    const products = await ProductModel.paginate(searchOptions, options);

    const productos = products.docs.map((products) => {
      return {
        title: products.title,
        description: products.description,
        code: products.code,
        price: products.price,
        status: products.status,
        stock: products.stock,
        category: products.category,
        thumbnail: products.thumbnail,
        id: products._id.toString(),
      };
    });

    return res.status(200).render("productos", {
      productos: productos,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const productId = await productService.getProductId(req.params.pid);
    res.status(200).json({ status: "Success", data: productId });
  } catch (error) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updates = req.body;
    const result = await productService.updateProduct(productId, updates);
    res.status(200).json({ status: "Success", data: result });
  } catch (error) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});

productRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const result = await productService.createProduct(newProduct);
    res.status(201).json({ status: "Success", data: result });
  } catch (err) {
    res.status(400).json({ status: "Error", data: err.message });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    const result = await productService.deleteProduct(productId);
    res.status(200).json({ status: "Success", data: result });
  } catch (error) {
    res.status(400).json({ status: "Error", data: error.message });
  }
});

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
