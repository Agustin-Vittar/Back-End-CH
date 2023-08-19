//@ts-check
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import passport from "passport";
import nodemailer from "nodemailer";
import twilio from "twilio";
import errorHandler from "./src/dao/middlewares/error.js";
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
import { entorno } from "./src/config/env-config.js";

import { productController } from "./src/routes/productsRealtime.router.js";
import { mockingproductsrouter } from "./src/routes/mockingproducts.js";

//console.log(entorno);
dotenv.config();
const app = express();
const port = entorno.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log({
  user: process.env.GOOGLE_EMAIL,
  pass: process.env.GOOGLE_PASSWORD,
});

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: entorno.MONGO_URL,
      ttl: 86400 * 7,
    }),
    secret: "secret-pass",
    resave: true,
    saveUninitialized: true,
  })
);

// Mailer

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

app.get("/mail", async (req, res) => {
  const result = await transport.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to: "agusjose122012@hotmail.com",
    subject: "Test email 2",
    html: `
      <div>
        <h1>Test Email</h1>
        <p>Prueba de enviar email</p>
      </div>
    `,
  });
  res.send({ status: "Success", result: "Email Sent" });
});

// Twilio

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get("/sms", async (req, res) => {
  const result = await client.messages.create({
    from: process.env.TWILIO_SMS_NUMBER,
    to: "+543731438314",
    body: "Buenassss",
  });

  res.send({ status: "Success", result: "SMS Sent" });
});

// Passport

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// Mongo

connectMongo();

// Config Handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
const productManager = new ProductManager();

// Endpoints

app.use("/api/products", productRouter);

app.use("/api/carts", cartsRouter);

app.use("/api/sessions", loginRouter);

app.use("/", viewRouter);

app.use("/realtime", productController);

app.use("/mockingproducts", mockingproductsrouter);

app.use(errorHandler);

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
    const updatedMsgs = await MsgModel.find({});
    socketServer.sockets.emit("all_msgs", updatedMsgs);
  });
});

app.get("*", (req, res) => {
  res.status(404).send({ status: "Error", data: "Page not found" });
});
