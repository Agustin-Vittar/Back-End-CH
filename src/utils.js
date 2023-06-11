import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import { connect } from "mongoose";

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
