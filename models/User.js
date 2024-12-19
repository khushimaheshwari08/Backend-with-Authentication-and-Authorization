const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Regex for email validation
    },
    password: {
      type: SchemaTypes.String,
      required: true,
      minlength: 6,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
