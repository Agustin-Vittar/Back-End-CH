import express from "express";
import { Router } from "express";
import { ProductModel } from "../dao/models/products.model.js";
import { CartService } from "../services/carts.service.js";

export const viewRouter = Router();
const cartService = new CartService();

viewRouter.get("/productos", async (req, res) => {
  const { limit, page, sort, query } = req.query;

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

  try {
    const products = await ProductModel.paginate(searchOptions, options);

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
      };
    });

    return res.status(200).render("productos", {
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
