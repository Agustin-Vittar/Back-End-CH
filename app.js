//@ts-check
import express from "express";
import handlebars from "express-handlebars";
import { ProductManager } from "./src/dao/productManager.js";
import { cartsRouter } from "./src/routes/carts.router.js";
import { productRouter } from "./src/routes/products.router.js";

import { __dirname } from "./src/utils.js";
import { productController } from "./src/controller/products-controller.js";
import { Server } from "socket.io";
import { connectMongo } from "./src/utils.js";
import { MsgModel } from "./src/dao/models/msgs.model.js";
import { viewRouter } from "./src/routes/view.router.js";

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Mongo

connectMongo();

//Config Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
const productManager = new ProductManager();

app.use("/api/products", productRouter);

app.use("/api/carts", cartsRouter);

app.use("/", viewRouter);

const httpServer = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("New client connected");
  const products = await productManager.getProducts();
  socket.emit("products", products);
  const msgs = await MsgModel.find({});
  socketServer.sockets.emit("all_msgs", msgs);

  socket.on("msg_front_to_back", async (msg) => {
    const msgCreated = await MsgModel.create(msg);
    const msgs = await MsgModel.find({});
    socketServer.sockets.emit("all_msgs", msgs);
  });
});

app.get("*", (req, res) => {
  res.status(404).send({ status: "Error", data: "Page not found" });
});
