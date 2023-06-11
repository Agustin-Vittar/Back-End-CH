//@ts-check

import { CartModel } from "../dao/models/carts.model.js";
import { ProductService } from "./products.service.js";

const productService = new ProductService();

export class CartService {
  static id = 0;

  constructor() {}

  async generateID() {
    CartService.id = CartService.id + 1;
    return CartService.id;
  }

  async generateCart() {
    try {
      const newCart = {
        id: await this.generateID(),
        products: [],
      };

      const createdCart = await CartModel.create(newCart);
      return createdCart;
    } catch (error) {
      throw new Error("Error creating cart");
    }
  }

  async getCartID(id) {
    try {
      const foundCart = await CartModel.findOne({ id });

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      return foundCart.products;
    } catch (error) {
      throw new Error("Error retrieving cart");
    }
  }

  async addProductsCart(cartId, productId) {
    try {
      const foundCart = await CartModel.findOne({ id: cartId });

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      const foundProduct = await productService.getProductId(productId);

      if (!foundProduct) {
        throw new Error("Product not found");
      }

      const foundProductCart = foundCart.products.find(
        (product) => product.id === productId
      );

      if (foundProductCart) {
        foundProductCart.quantity++;
      } else {
        foundCart.products.push({ id: productId, quantity: 1 });
      }

      await foundCart.save();
      return foundCart.products.find((product) => product.id === productId);
    } catch (error) {
      throw new Error("Error adding products to cart");
    }
  }
}
