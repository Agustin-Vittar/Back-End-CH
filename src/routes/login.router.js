import passport from "passport";
import { LoginController } from "../controller/login-controller.js";
import { Router } from "express";

export const loginRouter = Router();
const loginController = new LoginController();

loginRouter.post("/register", loginController.registerUser);

loginRouter.post("/login", loginController.loginUser);

loginRouter.get("/fail", loginController.showFailPage);

loginRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] })
);

loginRouter.get("/githubcallback", loginController.githubCallback);

loginRouter.get("/current", loginController.getCurrentSession);
