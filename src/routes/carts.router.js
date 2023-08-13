import { Router } from "express";
import express from "express";
import { CartController } from "../controller/cart-controller.js";
<<<<<<< HEAD
=======
import { authorizeUser } from "../dao/middlewares/auth.js";
>>>>>>> 9460772 (Preentrega Nº 3)
//import { CartManager } from "../dao/cartManager.js";

export const cartsRouter = Router();
const cartController = new CartController();
//const cartManager = new CartManager();

cartsRouter.use(express.json());
cartsRouter.use(express.urlencoded({ extended: true }));

cartsRouter.post("/", cartController.generateCart);

cartsRouter.get("/:cid", cartController.getCartByID);

<<<<<<< HEAD
cartsRouter.post("/:cid/product/:pid", cartController.addProductToCart);
=======
cartsRouter.post(
  "/:cid/product/:pid",
  /* authorizeUser, */
  cartController.addProductToCart
);
>>>>>>> 9460772 (Preentrega Nº 3)

cartsRouter.delete("/:cid/product/:pid", cartController.removeProductFromCart);

cartsRouter.put("/:cid", cartController.updateCartProducts);

cartsRouter.put("/:cid/product/:pid", cartController.updateProductQuantity);

cartsRouter.delete("/:cid", cartController.clearCart);
<<<<<<< HEAD
=======

cartsRouter.post(
  "/:cid/purchase",
  /* authorizeUser, */ cartController.purchaseCart
);
>>>>>>> 9460772 (Preentrega Nº 3)
