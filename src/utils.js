import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from "bcrypt";
<<<<<<< HEAD
=======
import { entorno } from "./config/env-config.js";
>>>>>>> 9460772 (Preentrega Nº 3)

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export async function connectMongo() {
  try {
<<<<<<< HEAD
    await connect(
      "mongodb+srv://joseagusvittar:uASeHnVhyUW27POM@vittar-cluster.ddxfzsa.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
=======
    await connect(entorno.MONGO_URL);
>>>>>>> 9460772 (Preentrega Nº 3)

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
<<<<<<< HEAD
=======

export function generateTicketCode() {
  const timestamp = Date.now().toString(36); // Convertir el timestamp a base 36
  const randomNum = Math.floor(Math.random() * 10000).toString(36); // Número aleatorio en base 36
  const ticketCode = timestamp + randomNum;

  return ticketCode.toUpperCase(); // Convertir a mayúsculas (opcional)
}
>>>>>>> 9460772 (Preentrega Nº 3)
