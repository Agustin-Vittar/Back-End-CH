import express from "express";
import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

export const loginRouter = Router();

loginRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/sessions/fail" }),
  async (req, res) => {
    try {
      res.status(200).redirect("/login");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ status: "Error", error: "Registration failed" });
    }
  }
);

loginRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/sessions/fail" }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "Error", error: "Invalid credentials" });

    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      _id: req.user._id.toString(),
    };
    return res.redirect("/productos");
  }
);

loginRouter.get("/fail", async (req, res) => {
  res.render("error-page");
});

loginRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] })
);

loginRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/productos");
  }
);

loginRouter.get("/current", (req, res) => {
  try {
    return res.status(200).json({
      status: "Success",
      message: "Session data",
      payload: req.session.user || {},
    });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: "Server error" });
  }
});

/* loginRouter.post("/register", async (req, res) => {
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
      password: createHash(password),
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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("error-page");
    }
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.firstName = "Admin";
      req.session.email = email;
      req.session.role = "admin";
      return res.redirect("/admin");
    }
    const foundUser = await UserModel.findOne({ email });
    if (foundUser && isValidPassword(password, foundUser.password)) {
      foundUser.password === password) req.session.firstName =
        foundUser.firstName;
      req.session.lastName = foundUser.lastName;
      req.session.email = foundUser.email;
      req.session.age = foundUser.age;
      req.session.role = foundUser.role;
      return res.redirect("/productos");
    } else {
      return res.status(401).render("error-page");
    }
  } catch (error) {
    return res.status(400).render("error-page");
  }
});
 */
