import { ProductModel } from "../dao/models/products.model.js";
import { ProductService } from "../services/products.service.js";

export class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = async (req, res) => {
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

      let prevLink = null;
      let nextLink = null;

      if (products.hasPrevPage) {
        prevLink = `?limit=${options.limit}&page=${products.prevPage}&sort=${sort}`;
      }

      if (products.hasNextPage) {
        nextLink = `?limit=${options.limit}&page=${products.nextPage}&sort=${sort}`;
      }

      return res.status(200).json({
        status: "Success",
        payload: productos,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  };

  getProductByID = async (req, res) => {
    try {
      const productId = await this.productService.getProductId(req.params.pid);
      res.status(200).json({ status: "Success", data: productId });
    } catch (error) {
      res.status(400).json({ status: "Error", data: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const productId = req.params.pid;
      const updates = req.body;
      const result = await this.productService.updateProduct(
        productId,
        updates
      );
      res.status(200).json({ status: "Success", data: result });
    } catch (error) {
      res.status(400).json({ status: "Error", data: error.message });
    }
  };

  createProduct = async (req, res) => {
    const newProduct = req.body;
    try {
      const result = await this.productService.createProduct(newProduct);
      res.status(201).json({ status: "Success", data: result });
    } catch (err) {
      res.status(400).json({ status: "Error", data: err.message });
    }
  };

  deleteProduct = async (req, res) => {
    const productId = req.params.pid;
    try {
      const result = await this.productService.deleteProduct(productId);
      res.status(200).json({ status: "Success", data: result });
    } catch (error) {
      res.status(400).json({ status: "Error", data: error.message });
    }
  };
}
