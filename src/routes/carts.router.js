import { Router } from "express";
import express from "express";
import { CartService } from "../services/carts.service.js";
//import { CartManager } from "../dao/cartManager.js";

export const cartsRouter = Router();
const cartService = new CartService();
//const cartManager = new CartManager();

cartsRouter.use(express.json());
cartsRouter.use(express.urlencoded({ extended: true }));

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartService.generateCart();
    res.status(201).json({ status: "Success", data: newCart });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const cartProducts = await cartService.getCartID(cartId);
    res.status(200).json({ status: "Success", data: cartProducts });
  } catch (error) {
    res.status(404).json({ status: "Error", error: "Cart not found" });
  }
});

cartsRouter.get("/cart/:cid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const cart = await cartService.getCartID(cartId);
    const cartProduct = cart.products.map((prod) => prod.toJSON());

    return res.status(200).render("cart", {
      cart,
      cartProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = req.params.pid;
    const addedProduct = await cartService.addProductsCart(cartId, productId);
    res.status(200).json({ status: "Success", data: addedProduct });
  } catch (error) {
    res.status(404).json({ status: "Error", error: error.message });
  }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = req.params.pid;
    await cartService.removeProductFromCart(cartId, productId);
    res
      .status(200)
      .json({ status: "Success", message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const newProducts = req.body.products;

    const invalidProducts = newProducts.filter(
      (product) =>
        Object.keys(product).length !== 2 ||
        !product.hasOwnProperty("id") ||
        !product.hasOwnProperty("quantity") ||
        product.quantity < 0
    );
    if (invalidProducts.length > 0) {
      const invalidProductIds = invalidProducts.map((product) => product.id);
      throw new Error(`Invalid product(s): ${invalidProductIds.join(", ")}`);
    }

    await cartService.updateCartProducts(cartId, newProducts);
    res
      .status(200)
      .json({ status: "Success", message: "Cart updated with new products" });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    await cartService.updateProductQuantity(cartId, productId, quantity);
    res
      .status(200)
      .json({ status: "Success", message: "Product quantity updated" });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    await cartService.clearCart(cartId);
    res.status(200).json({ status: "Success", message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});
