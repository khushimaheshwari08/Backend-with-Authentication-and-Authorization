const User = require("../../models/User"); // Import the User model

const userRepository = {
  // Add a new user to the database
  async add(userObject) {
    try {
      const user = new User(userObject);
      return await user.save(); // Save the user in the database
    } catch (error) {
      throw new Error("Error adding user: " + error.message);
    }
  },

  // Find a user by email
  async find(email) {
    try {
      return await User.findOne({ email }); // Query the database by email
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  },

  // Find a user by ID
  async findById(id) {
    try {
      return await User.findById(id); // Query the database by ID
    } catch (error) {
      throw new Error("Error finding user by ID: " + error.message);
    }
  },
};

module.exports = userRepository;
