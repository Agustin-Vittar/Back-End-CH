import { ProductModel } from "../dao/models/products.model.js";

export class ProductService {
  async getAllProducts() {
    try {
      const products = await ProductModel.find({});
      return products;
    } catch (error) {
      throw new Error("Error retrieving products");
    }
  }

  async getProductId(id) {
    try {
      const product = await ProductModel.findById(id);
      if (product) {
        return product;
      } else {
        throw new Error(`The product with this id: ${id} was not found`);
      }
    } catch (error) {
      throw new Error(`Error retrieving product with id: ${id}`);
    }
  }

  async updateProducts(id, updates) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error(`The product with this id: ${id} was not found`);
      }

      const allowedFields = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
        "thumbnail",
      ];

      const extraFields = Object.keys(updates).filter(
        (field) => !allowedFields.includes(field)
      );

      if (extraFields.length > 0) {
        throw new Error(`Invalid field(s) found: ${extraFields.join(", ")}`);
      }

      for (const key in updates) {
        if (key !== "id" && !product.hasOwnProperty(key)) {
          throw new Error(`Invalid field: ${key}`);
        }
        product[key] = updates[key];
      }

      await product.save();
      return product;
    } catch (error) {
      return error;
    }
  }

  async createProduct(newProduct) {
    try {
      const requiredFields = [
        "title",
        "description",
        "code",
        "price",
        "stock",
        "category",
        "thumbnail",
      ];

      const invalidFields = [];

      for (const field of requiredFields) {
        if (!newProduct.hasOwnProperty(field)) {
          invalidFields.push(`Missing field: ${field}`);
        } else {
          const value = newProduct[field];
          if (
            field === "title" &&
            (typeof value !== "string" || value.trim().length === 0)
          ) {
            invalidFields.push(
              `Invalid value for field ${field}. ${field} must be a non-empty string`
            );
          } else if (
            field === "price" &&
            (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
          ) {
            invalidFields.push(
              `Invalid value for field ${field}. ${field} must be a valid positive number`
            );
          } else if (
            field === "stock" &&
            (!Number.isInteger(value) || value < 0)
          ) {
            invalidFields.push(
              `Invalid value for field ${field}. ${field} must be a valid non-negative integer number`
            );
          } else if (
            field === "thumbnail" &&
            (!Array.isArray(value) ||
              value.length === 0 ||
              !value.every(
                (item) => typeof item === "string" && item.trim().length > 0
              ))
          ) {
            invalidFields.push(
              `Invalid value for field ${field}. ${field} must be a non-empty array of strings`
            );
          }
        }
      }

      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
      }

      const product = new ProductModel(newProduct);

      const existingProduct = await ProductModel.findOne({
        code: product.code,
      });

      if (existingProduct) {
        throw new Error("Product already registered");
      }

      await product.save();
      return product;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    const productDeleted = await ProductModel.deleteOne({ _id: id });
    return productDeleted;
  }
}

/* async getAllProducts() {
    const products = await ProductModel.find({});
    return products;
  }

  async getProductId(id) {
    const productId = await ProductModel.findById({ _id: id });
    return productId;
  }

  async updateProduct(id, updates) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = updates;
    const productUpdate = await ProductModel.findByIdAndUpdate(id, updates);
    return productUpdate;
  }

  async createProduct(newProduct) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = newProduct;

    const productCreated = await ProductModel.create(newProduct);
    return productCreated;
  }

  async deleteProduct(id) {
    const productDeleted = await ProductModel.deleteOne({ _id: id });
    return productDeleted;
  } */
