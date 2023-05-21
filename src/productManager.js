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
    for (const [key, value] of Object.entries(product)) {
      if (!value || value === "") {
        throw new Error(`The field ${key} is invalid or empty`);
      }
    }
  }

  addProduct(product) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));

    try {
      // Validamos si todos los campos están completos
      this.#verifyProducts(product);

      // Validamos si el producto ya existe en la lista
      if (this.#verifyCode(product.code)) {
        console.log("Product already registered");
        return "Product already registered";
      }

      // Generamos el id y agregamos el producto a la lista
      let newProduct = { ...product, id: this.#generateId() };
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

  updateProduct(id, key, value) {
    this.products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));

    if (key == "id") {
      return console.log(
        "It is not possible to modify the id field, try another field"
      );
    } else if (this.products.find((p) => p.id === id)) {
      const Found = this.products.find((p) => p.id == id);
      Found[key] = value;
      fs.writeFileSync(this.#path, JSON.stringify(this.products));
      return console.log("Updated product successfully", Found);
    } else {
      return console.log("Product not found");
    }
  }
}
