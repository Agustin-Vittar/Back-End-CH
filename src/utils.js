import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import bcrypt from "bcrypt";
import { entorno } from "./config/env-config.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export async function connectMongo() {
  try {
    await connect(entorno.MONGO_URL);

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

export function generateTicketCode() {
  const timestamp = Date.now().toString(36); // Convertir el timestamp a base 36
  const randomNum = Math.floor(Math.random() * 10000).toString(36); // Número aleatorio en base 36
  const ticketCode = timestamp + randomNum;

  return ticketCode.toUpperCase(); // Convertir a mayúsculas (opcional)
}
