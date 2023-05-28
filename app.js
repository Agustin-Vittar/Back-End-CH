import express from "express";
import handlebars from "express-handlebars";
import { ProductManager } from "./src/productManager.js";
import { cartsRouter } from "./src/routes/carts.router.js";
import { productRouter } from "./src/routes/products.router.js";
import { __dirname } from "./src/utils.js";
import { productController } from "./src/controller/products-controller.js";
import { Server } from "socket.io";

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
const productManager = new ProductManager();

app.use("/api/products", productRouter);

app.use("/api/carts", cartsRouter);

app.use("/", productController);

const httpServer = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("New client connected");
  const products = await productManager.getProducts();
  socket.emit("products", products);
});

app.get("*", (req, res) => {
  res.status(404).send({ status: "Error", data: "Page not found" });
});
