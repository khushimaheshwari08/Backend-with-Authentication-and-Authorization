const express = require("express");
const { register, login, profile } = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const userRouter = express.Router();

userRouter.post("/register", register); // User registration
userRouter.post("/login", login); // User login
userRouter.get("/profile", authenticate, profile); // Fetch user profile

module.exports = userRouter;
