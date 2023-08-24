import LoginDTO from "../dao/DTOs/login.dto.js";
import { CartService } from "../services/carts.service.js";
import { LoginService } from "../services/login-service.js";
import passport from "passport";
import { loggerDev } from "../utils/logger.js";

export class LoginController {
  constructor() {
    this.loginService = new LoginService();
    this.cartService = new CartService();
  }

  loginUser = async (req, res) => {
    passport.authenticate(
      "login",
      { failureRedirect: "/api/sessions/fail" },
      async (err, user) => {
        if (err) {
          loggerDev.error("Error in login:", err);
          return res
            .status(500)
            .send({ status: "Error", error: "Login failed" });
        }

        if (!user) {
          return res
            .status(400)
            .send({ status: "Error", error: "Invalid credentials" });
        }

        req.session.user = {
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          email: user.email,
          role: user.role,
          _id: user._id.toString(),
        };

        res.redirect("/productos");
      }
    )(req, res);
  };

  registerUser = async (req, res, next) => {
    try {
      const userData = req.body;
      const newCart = await this.cartService.generateCart();
      userData.cart = newCart._id;

      const newUser = await this.loginService.registerUser(userData);

      await newUser.save();

      res.status(200).redirect("/login");
    } catch (error) {
      loggerDev.error(error);
      res.status(500).send({ status: "Error", error: "Registration failed" });
    }
  };

  githubCallback = (req, res, next) => {
    passport.authenticate(
      "github",
      { failureRedirect: "/login" },
      async (err, user) => {
        if (err) {
          loggerDev.error("Error in GitHub authentication:", err);
          return res
            .status(500)
            .send({ status: "Error", error: "GitHub authentication failed" });
        }

        try {
          if (!user) {
            throw new Error("User not found");
          }

          req.session.user = user;
          res.redirect("/productos");
        } catch (error) {
          loggerDev.error("Error in GitHub authentication callback:", error);
          res.status(500).send({
            status: "Error",
            error: "GitHub authentication callback failed",
          });
        }
      }
    )(req, res, next);
  };

  showFailPage = async (req, res) => {
    res.render("error-page");
  };

  getCurrentSession = async (req, res) => {
    try {
      let usuario = req.session.user;

      let userDTO = new LoginDTO(usuario);
      return res.status(200).json({
        status: "Success",
        message: "Session data",
        payload: userDTO || {},
      });
    } catch (error) {
      return res.status(500).json({ status: "Error", message: "Server error" });
    }
  };
}
