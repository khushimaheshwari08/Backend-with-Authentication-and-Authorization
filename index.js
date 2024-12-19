const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./configs/mongodb"); // connecting mongodb here

app.use(express.json()); //middleware to parse json
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

app.use(cors({ origin: "*" })); // Enabling CORS for all origins

// Include both the userRouter and invoiceRouter
app.use("/users", require("./routers/userRouter")); // For user-related routes like register, login, profile
app.use("/", require("./routers/invoiceRouter")); // For invoice-related routes

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}...`)
);
