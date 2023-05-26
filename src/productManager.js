import fs from "fs";

export class ProductManager {
  #path;

  constructor() {
    if (!fs.existsSync("./productos.json")) {
      fs.writeFileSync("./productos.json", "[]", "utf-8");
    }
    this.products = [];
    this.#path = "./productos.json";
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    if (this.products.length > 0) {
      ProductManager.id = this.products[this.products.length - 1].id;
    }
  }

  getProducts() {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    console.log(this.products);
    return this.products;
  }

  #generateId() {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    let maxId = 0;
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product.id > maxId) {
        maxId = product.id;
      }
    }

    return ++maxId;
  }

  getProductById(id) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    const found = this.products.find((product) => product.id == id);
    if (found) {
      return found;
    } else {
      throw new Error(`The product with this id: ${id} was not found`);
    }
  }

  #verifyCode(code) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    return this.products.some((product) => product.code === code);
  }

  #verifyProducts(product) {
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
      if (!product.hasOwnProperty(field)) {
        invalidFields.push(`Missing field: ${field}`);
      } else {
        const value = product[field];
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
      throw new Error(`Invalid or missing fields: ${invalidFields.join(", ")}`);
    }
  }

  addProduct(product) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));

    try {
      // Validar si todos los campos están completos y permitidos
      this.#verifyProducts(product);

      // Validar si el producto ya existe en la lista
      if (this.#verifyCode(product.code)) {
        console.log("Product already registered");
        return "Product already registered";
      }

      // Validar si hay campos adicionales no permitidos
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

      const extraFields = Object.keys(product).filter(
        (field) => !allowedFields.includes(field)
      );

      if (extraFields.length > 0) {
        throw new Error(`Invalid field(s) found: ${extraFields.join(", ")}`);
      }

      // Generar el id y agregar el producto a la lista
      const newProduct = { ...product, id: this.#generateId() };
      this.products.push(newProduct);
      fs.writeFileSync(this.#path, JSON.stringify(this.products));
      console.log("Successful registration", newProduct);

      return "Successful registration";
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  deleteProduct(id) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));

    if (this.products.find((prod) => prod.id === id)) {
      this.products.splice(
        this.products.indexOf(this.products.find((prod) => prod.id == id)),
        1
      );
      fs.writeFileSync(this.#path, JSON.stringify(this.products));
      return console.log("Deleted product successfully");
    } else {
      return console.log("Product not found");
    }
  }

  updateProduct(id, updates) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));

    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const product = this.products[productIndex];

    for (const key in updates) {
      if (key !== "id" && !product.hasOwnProperty(key)) {
        throw new Error(`Invalid field: ${key}`);
      }

      product[key] = updates[key];
    }

    fs.writeFileSync(this.#path, JSON.stringify(this.products));
    return product;
  }
}
