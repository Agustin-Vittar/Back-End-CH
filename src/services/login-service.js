import { isValidPassword, createHash } from "../utils.js";
import { UserModel } from "../dao/models/user.model.js";
import { CartModel } from "../dao/models/carts.model.js";

export class LoginService {
  async registerUser(userData) {
    try {
      const { email, firstName, lastName, age, password } = userData;

      if (!email || !firstName || !lastName || !age || !password || age <= 0) {
        throw new Error("Missing required fields");
      }

      let user = await UserModel.findOne({ email });

      if (user) {
        throw new Error("User already exists");
      }

      const newUser = {
        firstName,
        lastName,
        age,
        email,
        password: createHash(password),
        role: "user",
      };

      const userCreated = await UserModel.create(newUser);

      const cart = await CartModel.create({ user: userCreated._id });

      userCreated.cart = cart._id;

      await userCreated.save();

      console.log("User registration successful");
      return userCreated;
    } catch (error) {
      console.log("Error in registerUser:", error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const foundUser = await UserModel.findOne({ email });
      if (foundUser && isValidPassword(password, foundUser.password)) {
        return foundUser;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error in loginUser", error);
      throw error;
    }
  }
}
