import { CartModel } from "../dao/models/carts.model.js";
import { ProductModel } from "../dao/models/products.model.js";
<<<<<<< HEAD
=======
import { TicketModel } from "../dao/models/ticket.model.js";
import { generateTicketCode } from "../utils.js";
>>>>>>> 9460772 (Preentrega Nº 3)
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
<<<<<<< HEAD
        id: await this.generateID(),
=======
>>>>>>> 9460772 (Preentrega Nº 3)
        products: [],
      };

      const createdCart = await CartModel.create(newCart);
      return createdCart;
    } catch (error) {
      throw new Error("Error creating cart");
    }
  }

<<<<<<< HEAD
  async getCartID(id) {
    try {
      const foundCart = await CartModel.findOne({ id }).populate("products.id");
=======
  async getCartID(cartId) {
    try {
      const foundCart = await CartModel.findOne({ _id: cartId }).populate(
        "products.id"
      );
>>>>>>> 9460772 (Preentrega Nº 3)

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
<<<<<<< HEAD
      const foundCart = await CartModel.findOne({ id: cartId });
=======
      const foundCart = await CartModel.findOne({ _id: cartId });
>>>>>>> 9460772 (Preentrega Nº 3)

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
<<<<<<< HEAD
      const foundCart = await CartModel.findOne({ id: cartId });
=======
      const foundCart = await CartModel.findOne({ _id: cartId });
>>>>>>> 9460772 (Preentrega Nº 3)

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      const productIndex = foundCart.products.findIndex(
        (product) => product.id.toString() === productId.toString()
      );

      if (productIndex === -1) {
        throw new Error();
      }

      foundCart.products.splice(productIndex, 1);

      await foundCart.save();
    } catch (error) {
      throw new Error("Error removing product from cart");
    }
  }

  async updateCartProducts(cartId, newProducts) {
    try {
<<<<<<< HEAD
      const foundCart = await CartModel.findOne({ id: cartId });
=======
      const foundCart = await CartModel.findOne({ _id: cartId });
>>>>>>> 9460772 (Preentrega Nº 3)

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
<<<<<<< HEAD
      const foundCart = await CartModel.findOne({ id: cartId });
=======
      const foundCart = await CartModel.findOne({ _id: cartId });
>>>>>>> 9460772 (Preentrega Nº 3)

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      const foundProduct = foundCart.products.find(
        (products) => products.id.toString() === productId.toString()
      );

      if (!foundProduct) {
        throw new Error("Product not found in cart");
      }

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      foundProduct.quantity = quantity;

      await foundCart.save();
    } catch (error) {
      throw new Error("Error updating product quantity");
    }
  }

  async clearCart(cartId) {
    try {
<<<<<<< HEAD
      const foundCart = await CartModel.findOne({ id: cartId });
=======
      const foundCart = await CartModel.findOne({ _id: cartId });
>>>>>>> 9460772 (Preentrega Nº 3)

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      foundCart.products = [];

      await foundCart.save();
    } catch (error) {
      throw new Error("Error clearing cart");
    }
  }
<<<<<<< HEAD
=======

  async purchaseCart(cartId, purchaserEmail) {
    try {
      const foundCart = await CartModel.findOne({ _id: cartId }).populate(
        "products.id"
      );

      if (!foundCart) {
        throw new Error("Cart not found");
      }

      const productsWithInsufficientStock = [];

      for (const product of foundCart.products) {
        const productFromDB = await ProductModel.findById(product.id._id);

        if (!productFromDB || productFromDB.stock < product.quantity) {
          productsWithInsufficientStock.push(product.id._id);
        } else {
          productFromDB.stock -= product.quantity;
          await productFromDB.save();
        }
      }

      foundCart.products = foundCart.products.filter(
        (product) => !productsWithInsufficientStock.includes(product.id._id)
      );

      await foundCart.save();

      const totalAmount = await this.calculateTotalAmount(foundCart.products);

      const ticket = new TicketModel({
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: purchaserEmail, // Asegúrate de reemplazar "userId" con la propiedad correcta
      });

      await ticket.save();

      await this.clearCart(cartId);

      return ticket._id;
    } catch (error) {
      throw new Error("Error al realizar la compra: " + error.message);
    }
  }

  async calculateTotalAmount(cartProducts) {
    try {
      let totalAmount = 0;

      for (const cartProduct of cartProducts) {
        const product = await ProductModel.findById(cartProduct.id);

        if (!product) {
          throw new Error("Product not found");
        }

        totalAmount += product.price * cartProduct.quantity;
      }

      return totalAmount; // Devuelve el valor numérico calculado
    } catch (error) {
      throw new Error("Error calculating total amount");
    }
  }
>>>>>>> 9460772 (Preentrega Nº 3)
}
