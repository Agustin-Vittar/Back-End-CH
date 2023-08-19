import { Router } from "express";
import CustomError from "../services/errors/custom-error";
import EErrors from "../services/errors/enums";
import { generateUserErrorInfo } from "../services/errors/info";

const users = [];

const router = Router();

router.get("/", (req, res) => {
  res.send({ status: "Success", payload: users });
});

router.post("/", (req, res) => {
  const { first_name, last_name, age, email } = req.body;
  if (!first_name || !last_name || !email) {
    CustomError.createError({
      name: "User creation error",
      cause: generateUserErrorInfo({ first_name, last_name, age, email }),
      message: "Error trying to create user",
      code: EErrors.INVALID_TYPES_ERROR,
    });
  }
  const user = {
    first_name,
    last_name,
    age,
    email,
  };
  if (users.length === 0) {
    user.id = 1;
  } else {
    user.id = users[users.length - 1].id + 1;
  }
  users.push(user);
  res.send({ status: "Success", payload: users });
});
