import dotenv from "dotenv";
import { loggerDev } from "../utils/logger.js";

if (process.argv[2] != "DEV" && process.argv[2] != "PROD") {
  loggerDev.warn("No está bien el argumento!");
  process.exit();
}

dotenv.config({
  path: process.argv[2] === "DEV" ? "./.env.development" : "./.env.production",
});
loggerDev.info(
  "Port: " + process.env.PORT + " || " + "Mongo URL:" + process.env.MONGO_URL
);

export const entorno = {
  MODE: process.argv[2],
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
