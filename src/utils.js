import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from "bcrypt";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://joseagusvittar:uASeHnVhyUW27POM@vittar-cluster.ddxfzsa.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );

    console.log("plug to mongo!");
  } catch (error) {
    console.log(error);
    throw "can not connect to the db";
  }
}

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);
