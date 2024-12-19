// MONGO DB Configuration
const mongoose = require("mongoose");

const URL_VALUE = process.env.MONGODEV;

//Connecting to DB.....
mongoose
  .connect(URL_VALUE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.log(err.message));
