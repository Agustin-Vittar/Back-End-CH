import { Router } from "express";
import { ProductModel } from "../dao/models/products.model.js";
import { CartService } from "../services/carts.service.js";
import { authorizeAdmin, authorizeUser } from "../dao/middlewares/auth.js";
import { UserModel } from "../dao/models/user.model.js";

export const viewRouter = Router();
const cartService = new CartService();

viewRouter.get("/productos", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const { firstName, lastName, email, age, role } = req.session.user || {};

    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
    };

    const searchOptions = query ? { category: query } : {};

    if (sort === "asc") {
      options.sort = { price: 1 };
    } else if (sort === "desc") {
      options.sort = { price: -1 };
    }

    const products = await ProductModel.paginate(searchOptions, options);

    const user = await UserModel.findOne({ email: email });
    const cartID = user && user.cart ? user.cart._id.toString() : null;

    const productos = products.docs.map((products) => {
      return {
        title: products.title,
        description: products.description,
        code: products.code,
        price: products.price,
        status: products.status,
        stock: products.stock,
        category: products.category,
        thumbnail: products.thumbnail,
        id: products._id.toString(),
        cartID: cartID,
      };
    });

    return res.status(200).render("productos", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      role: role,
      cartID: cartID,
      productos: productos,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

viewRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
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

viewRouter.get("/login", (req, res) => {
  try {
    return res.status(200).render("login-form");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

viewRouter.get("/register", (req, res) => {
  try {
    return res.status(200).render("register-form");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

viewRouter.get("/logout", (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        return res.render("error-page");
      }
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

viewRouter.get("/profile", authorizeUser, (req, res) => {
  try {
    res.status(200).render("profile");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

viewRouter.get("/admin", authorizeAdmin, (req, res) => {
  try {
    const { role } = req.session;
    res.status(200).render("admin", {
      role: role,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});
