import express from "express";
import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";

export const loginRouter = Router();

loginRouter.post("/register", async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;
  if (!firstName || !lastName || !age || !email || !password) {
    return res.status(400).render("error-page");
  }
  try {
    await UserModel.create({
      firstName,
      lastName,
      age,
      email,
      password,
      role: "user",
    });
    req.session.firstName = firstName;
    req.session.email = email;
    req.session.role = "user";
    return res.redirect("/profile");
  } catch (error) {
    console.log(error);
    return res.status(400).render("error-page");
  }
});

loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render("error-page");
  }
  try {
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.firstName = "Admin";
      req.session.email = email;
      req.session.role = "admin";
      return res.redirect("/admin");
    }
    const foundUser = await UserModel.findOne({ email });
    if (foundUser && foundUser.password === password) {
      req.session.firstName = foundUser.firstName;
      req.session.lastName = foundUser.lastName;
      req.session.email = foundUser.email;
      req.session.age = foundUser.age;
      req.session.role = foundUser.role;
      return res.redirect("/productos");
    } else {
      return res.status(400).render("error-page");
    }
  } catch (error) {
    return res.status(400).render("error-page");
  }
});
