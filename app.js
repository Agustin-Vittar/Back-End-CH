//@ts-check
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import { ProductManager } from "./src/dao/productManager.js";
import { cartsRouter } from "./src/routes/carts.router.js";
import { productRouter } from "./src/routes/products.router.js";
import { viewRouter } from "./src/routes/view.router.js";
import { loginRouter } from "./src/routes/login.router.js";
import { __dirname } from "./src/utils.js";
import { Server } from "socket.io";
import { connectMongo } from "./src/utils.js";
import { MsgModel } from "./src/dao/models/msgs.model.js";
import { iniPassport } from "./src/config/passport.config.js";
import passport from "passport";

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://joseagusvittar:uASeHnVhyUW27POM@vittar-cluster.ddxfzsa.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 86400 * 7,
    }),
    secret: "secret-pass",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

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

app.use("/api/sessions", loginRouter);

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
