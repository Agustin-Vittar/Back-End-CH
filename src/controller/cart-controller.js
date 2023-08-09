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
      const cartId = Number(req.params.cid);
      const cartProducts = await this.cartService.getCartID(cartId);
      res.status(200).json({ status: "Success", data: cartProducts });
    } catch (error) {
      res.status(404).json({ status: "Error", error: "Cart not found" });
    }
  };

  addProductToCart = async (req, res) => {
    try {
      const cartId = Number(req.params.cid);
      const productId = req.params.pid;
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
      const cartId = Number(req.params.cid);
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
      const cartId = Number(req.params.cid);
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
      const cartId = Number(req.params.cid);
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
      const cartId = Number(req.params.cid);
      await this.cartService.clearCart(cartId);
      res.status(200).json({ status: "Success", message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  };
}
