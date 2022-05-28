//require installed packages
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
require("dotenv").config();

// local imports
const initializePassport = require("./passport-config");

//Get environment variables and explicitly declare variables
const port = process.env.PORT || 3000;
const DB_URL = process.env.MONGODB_URI || "mongodb://localhost/binarypay";
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyparser.urlencoded({ extended: false }));
// app.use(bodyparser.json());
app.use(cookieParser());

// adding static files
app.use("/static", express.static(path.join(__dirname, "../binary-pay/dist")));

// routing intergration
app.use(require("./routes"));

// declare and initialize passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

//connect to database
mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err
      ? console.log(`There was an error: ${err.message}`)
      : console.log("Connected successfully to database!!");
  }
);

//maintain connection to the database
mongoose.connection;

//start server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
