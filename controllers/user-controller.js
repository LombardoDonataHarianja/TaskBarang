const { User } = require("../models/index");
const { verifyHash, generateHash } = require("../helpers/bcrypt");
const { generateTokenFromPayload } = require("../helpers/jwt");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // Check if the email or username already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      console.log("Existing user:", existingUser); // Log the existing user

      if (existingUser) {
        throw {
          name: "DuplicateData",
          message: "Username or email already exists",
        };
      }

      // If not exists, hash the password and create the user
      const hashedPassword = generateHash(password);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      res.status(201).json({
        message: `Account with username "${username}" successfully created`,
      });
    } catch (err) {
      // Handle errors
      console.error("Error in register:", err); // Log the error
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        throw {
          name: "Unauthorized",
          message: "Email and password are required",
        };
      }

      // Find user by email
      const foundUser = await User.findOne({ where: { email } });

      // If user not found, throw Unauthorized error
      if (!foundUser) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      // Verify password
      const isMatchPassword = verifyHash(password, foundUser.password);

      // If password doesn't match, throw Unauthorized error
      if (!isMatchPassword) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      // Generate token payload
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
      };

      // Generate JWT token
      const token = generateTokenFromPayload(payload);

      // Send token and user data in response
      res.status(200).json({
        access_token: token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          resetToken: foundUser.resetToken,
        },
      });
    } catch (err) {
      // Handle errors
      next(err);
    }
  }
}

module.exports = UserController;
