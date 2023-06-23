import { CartModel } from "../dao/models/carts.model.js";
import { ProductModel } from "../dao/models/products.model.js";
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
      const foundCart = await CartModel.findOne({ id }).populate("products.id");

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      return foundCart;
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

      const foundProduct = await ProductModel.findById(productId);

      if (!foundProduct) {
        throw new Error("Product not found");
      }

      const foundProductCart = foundCart.products.find(
        (product) => product.id.toString() === foundProduct._id.toString()
      );

      if (foundProductCart) {
        foundProductCart.quantity++;
      } else {
        foundCart.products.push({
          id: foundProduct._id,
          quantity: 1,
        });
      }

      await foundCart.save();
      return foundCart.products.find(
        (product) => product.id.toString() === foundProduct._id.toString()
      );
    } catch (error) {
      throw new Error("Error adding products to cart");
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const foundCart = await CartModel.findOne({ id: cartId });

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      foundCart.products = foundCart.products.filter(
        (product) => product.id !== productId
      );

      await foundCart.save();
    } catch (error) {
      throw new Error("Error removing product from cart");
    }
  }

  async updateCartProducts(cartId, newProducts) {
    try {
      const foundCart = await CartModel.findOne({ id: cartId });

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      foundCart.products = newProducts;

      await foundCart.save();
    } catch (error) {
      throw new Error("Error updating cart products");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const foundCart = await CartModel.findOne({ id: cartId });

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      const foundProduct = foundCart.products.find(
        (products) => products.id === productId
      );

      if (!foundProduct) {
        throw new Error("Product not found in cart");
      }

      foundProduct.quantity = quantity;

      await foundCart.save();
    } catch (error) {
      throw new Error("Error updating product quantity");
    }
  }

  async clearCart(cartId) {
    try {
      const foundCart = await CartModel.findOne({ id: cartId });

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      foundCart.products = [];

      await foundCart.save();
    } catch (error) {
      throw new Error("Error clearing cart");
    }
  }
}
