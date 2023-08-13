<<<<<<< HEAD
=======
import { authorizeUser } from "../dao/middlewares/auth.js";
import { CartModel } from "../dao/models/carts.model.js";
import { UserModel } from "../dao/models/user.model.js";
>>>>>>> 9460772 (Preentrega Nº 3)
import { CartService } from "../services/carts.service.js";

export class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  generateCart = async (req, res) => {
    try {
      const newCart = await this.cartService.generateCart();
      res.status(201).json({ status: "Success", data: newCart });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  };

  getCartByID = async (req, res) => {
    try {
<<<<<<< HEAD
      const cartId = Number(req.params.cid);
=======
      const cartId = req.params.cid;
>>>>>>> 9460772 (Preentrega Nº 3)
      const cartProducts = await this.cartService.getCartID(cartId);
      res.status(200).json({ status: "Success", data: cartProducts });
    } catch (error) {
      res.status(404).json({ status: "Error", error: "Cart not found" });
    }
  };

  addProductToCart = async (req, res) => {
    try {
<<<<<<< HEAD
      const cartId = Number(req.params.cid);
      const productId = req.params.pid;
=======
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const users = req.session.user;

      if (
        users &&
        users.cart &&
        users.cart._id.toString() !== cartId.toString()
      ) {
        return res
          .status(403)
          .json({ status: "Error", message: "Unauthorized" });
      }

>>>>>>> 9460772 (Preentrega Nº 3)
      const addedProduct = await this.cartService.addProductsCart(
        cartId,
        productId
      );
      res.status(200).json({ status: "Success", data: addedProduct });
    } catch (error) {
      res.status(404).json({ status: "Error", error: error.message });
    }
  };

  removeProductFromCart = async (req, res) => {
    try {
<<<<<<< HEAD
      const cartId = Number(req.params.cid);
=======
      const cartId = req.params.cid;
>>>>>>> 9460772 (Preentrega Nº 3)
      const productId = req.params.pid;
      await this.cartService.removeProductFromCart(cartId, productId);
      res
        .status(200)
        .json({ status: "Success", message: "Product removed from cart" });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  };

  updateCartProducts = async (req, res) => {
    try {
<<<<<<< HEAD
      const cartId = Number(req.params.cid);
=======
      const cartId = req.params.cid;
>>>>>>> 9460772 (Preentrega Nº 3)
      const newProducts = req.body.products;

      const invalidProducts = newProducts.filter(
        (product) =>
          Object.keys(product).length !== 2 ||
          !product.hasOwnProperty("id") ||
          !product.hasOwnProperty("quantity") ||
          product.quantity <= 0
      );
      if (invalidProducts.length > 0) {
        const invalidProductIds = invalidProducts.map((product) => product.id);
        throw new Error(`Invalid product(s): ${invalidProductIds.join(", ")}`);
      }

      await this.cartService.updateCartProducts(cartId, newProducts);
      res
        .status(200)
        .json({ status: "Success", message: "Cart updated with new products" });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
<<<<<<< HEAD
      const cartId = Number(req.params.cid);
=======
      const cartId = req.params.cid;
>>>>>>> 9460772 (Preentrega Nº 3)
      const productId = req.params.pid;
      const quantity = req.body.quantity;
      await this.cartService.updateProductQuantity(cartId, productId, quantity);
      res
        .status(200)
        .json({ status: "Success", message: "Product quantity updated" });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  };

  clearCart = async (req, res) => {
    try {
<<<<<<< HEAD
      const cartId = Number(req.params.cid);
=======
      const cartId = req.params.cid;
>>>>>>> 9460772 (Preentrega Nº 3)
      await this.cartService.clearCart(cartId);
      res.status(200).json({ status: "Success", message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  };
<<<<<<< HEAD
=======

  purchaseCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartService.getCartID(cartId);

      const purchaserEmail = req.session.user && req.session.user.email;

      console.log(purchaserEmail);

      if (!purchaserEmail) {
        return res
          .status(401)
          .json({ status: "Error", error: "User not authenticated" });
      }

      const ticketId = await this.cartService.purchaseCart(cart);

      res.status(200).json({
        status: "Success",
        message: "Compra realizada exitosamente",
        ticketId: ticketId,
      });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
      console.log(error);
    }
  };
>>>>>>> 9460772 (Preentrega Nº 3)
}
