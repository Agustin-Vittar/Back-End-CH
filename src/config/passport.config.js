import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/utils.js";
import { UserModel } from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2";
import { loggerDev } from "../utils/logger.js";
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const foundUser = await UserModel.findOne({ email: username });
          if (foundUser && isValidPassword(password, foundUser.password)) {
            return done(null, foundUser);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;

          // Validar campos obligatorios
          if (!email || !firstName || !lastName || !age || !password) {
            loggerDev.info("Missing required fields");
            return done(null, false);
          }

          let user = await UserModel.findOne({ email: username });
          if (user) {
            loggerDev.info("User already exist");
            return done(null, false);
          }

          const newUser = {
            firstName,
            lastName,
            age,
            email,
            password: createHash(password),
            role: "user",
          };
          let userCreated = await UserModel.create(newUser);
          loggerDev.info("User registration succesful");
          return done(null, userCreated);
        } catch (error) {
          loggerDev.error("Error in register");
          loggerDev.error(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.835104b38b1877e8",
        clientSecret: "2c6216c4fe454df00ed1887f081affe938d85dcc",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, _, profile, done) => {
        loggerDev.info(profile);
        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: "Bearer " + accesToken,
              "X-Github-Api-Version": "2022-11-28",
            },
          });
          const emails = await res.json();
          loggerDev.info(emails);
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error("Cannot get a valid mail for this user"));
          }

          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });

          if (!user) {
            const newUser = {
              firstName: profile._json.name || profile._json.login || "",
              lastName: "",
              age: "",
              email: profile.email,
              role: "user",
            };
            let userCreated = await UserModel.create(newUser);
            loggerDev.info("User Registration successful");
            return done(null, userCreated);
          } else {
            loggerDev.warn("User already exist");
            return done(null, user);
          }
        } catch (error) {
          loggerDev.error("Error in auth github");
          loggerDev.error(error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

/* 
export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log("User not found with username (email) " + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log("Invalid password");
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName } = req.body;
          let user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exist");
            return done(null, false);
          }

          const newUser = {
            firstName,
            lastName,
            age,
            email,
            password: createHash(password),
            role: "user",
          };
          let userCreated = await UserModel.create(newUser);
          console.log(userCreated);
          console.log("User registration succesful");
          return done(null, userCreated);
        } catch (error) {
          console.log("Error in register");
          console.log(error);
          return done(error);
        }
      }
    )
  );
} */
