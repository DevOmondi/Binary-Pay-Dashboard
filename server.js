//require installed packages
const express = require("express");
const mongoose = require("mongoose");
// const bodyparser = require("body-parser");
// const cookieParser = require("cookie-parser");
const fs = require("fs");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const db = require("./models");
require("dotenv").config();

// local imports
const initializePassport = require("./passport-config");

//Get environment variables and explicitly declare variables
const port = process.env.PORT || 5000;
const app = express();
const pathToKey = path.join(__dirname, "./cryptography/id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");

//middlewares
app.use(
  cors({
    credentials: true,
    mehods: ["GET, PATCH, POST, DELETE"],
    allowedHeaders: ["Authorization", "Content-Type", "credentials"],
    exposedHeaders: ["authorization", "credentials"],
    preflightContinue: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adding static files
app.use(express.static(path.join(__dirname, "./binary-pay/build")));

// routing integration
app.use(require("./routes"));

// setup session management to allow for a logged in user session to be maintained
app.use(
  session({
    secret: PUB_KEY,
    resave: true,
    saveUninitialized: false,
  })
);

// declare and initialize passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

//connect to database and crate tables if they don't exist
db.sequelize
  .sync({force:true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

//start server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
