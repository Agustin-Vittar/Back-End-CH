import * as fs from "fs";

import { ProductManager } from "./productManager.js";

const productManager = new ProductManager();

export class CartManager {
  static id = 0;
  carts = [];
  path = "./cart.json";

  constructor() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]", "utf-8");
    }

    this.carts = JSON.parse(fs.readFileSync(this.path), "utf-8");
    if (this.carts.length > 0) {
      CartManager.id = this.carts[this.carts.length - 1].id;
    }
  }

  #generateID() {
    CartManager.id = CartManager.id + 1;
    return CartManager.id;
  }

  generateCart() {
    return new Promise((res, rej) => {
      const newCart = {
        id: this.#generateID(),
        products: [],
      };

      this.carts.push(newCart);
      const cartsStrig = JSON.stringify(this.carts);
      fs.writeFileSync(this.path, cartsStrig);
      res(newCart);
    });
  }

  getCartID(id) {
    return new Promise((res, rej) => {
      const foundCart = this.carts.find((cart) => cart.id == id);

      if (!foundCart) {
        rej(new Error("Cart not found"));
      } else {
        res(foundCart.products);
      }
    });
  }

  addProductsCart(cartId, productId) {
    return new Promise((res, rej) => {
      const foundCart = this.carts.find((cart) => cart.id == cartId);

      if (!foundCart) {
        rej(new Error("Cart not found"));
      }

      const foundProduct = productManager.products.find(
        (product) => product.id == productId
      );

      if (!foundProduct) {
        rej(new Error("Product not found"));
      } else {
        const foundProductCart = foundCart.products.find(
          (product) => product.id == productId
        );

        if (foundProductCart) {
          foundProductCart.quantity++;
          const cartsString = JSON.stringify(this.carts);
          fs.writeFileSync(this.path, cartsString);
          res(foundProductCart);
        } else {
          const productToCart = { id: foundProduct.id, quantity: 1 };
          foundCart.products.push(productToCart);
          const cartsString = JSON.stringify(this.carts);
          fs.writeFileSync(this.path, cartsString);
          res(productToCart);
        }
      }
    });
  }
}
