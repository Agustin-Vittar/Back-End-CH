import express from "express";
import { ProductManager } from "./src/productManager.js";
import { productRouter } from "./src/routes/products.router.js";
import { cartsRouter } from "./src/routes/carts.router.js";

const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));
const productManager = new ProductManager();

app.use("/api/products", productRouter);

app.use("/api/carts", cartsRouter);

app.get("*", (req, res) => {
  res.status(404).send({ status: "Error", data: "Page not found" });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
