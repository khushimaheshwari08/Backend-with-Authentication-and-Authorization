const repo = require("../db/repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  // Register Function
  async register(req, res) {
    try {
      const userObject = req.body;

      if (!userObject.email || !userObject.password || !userObject.name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Generate hash for the password
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(userObject.password, salt);

      userObject.password = hashedPassword;

      // Save user in the repository
      const savedUser = await repo.add(userObject);
      return res
        .status(201)
        .json({ message: "User registered successfully", user: savedUser });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error in user registration", error: err.message });
    }
  },

  // Login Function
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await repo.find(email);

      if (!user) {
        return res
          .status(404)
          .json({ message: "Invalid email or user does not exist" });
      }

      // Compare password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken: token,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error during login", error: err.message });
    }
  },

  // Profile Function
  async profile(req, res) {
    try {
      const userId = req.user.id;
      const user = await repo.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Profile fetched successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error fetching profile", error: err.message });
    }
  },
};
