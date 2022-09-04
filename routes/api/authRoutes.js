const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const passport = require("passport");

const {
  updateProfileResponse,
  handleResponseErrors,
  getUserByUsername,
} = require("../../utility");

const pathToKey = path.join(__dirname, "../../cryptography/id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf-8");

const issueJwt = (id) => {
  const expiresIn = "1h";
  const payload = {
    sub: id,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: "RS256",
  });
  return { token: `Bearer ${signedToken}`, expires: expiresIn };
};

const authRoutes = (User) => {
  const authRouter = express.Router();

  authRouter.route("/login").post(async (req, res) => {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
      return res
        .status(400)
        .json({ errorMessage: "Credentials provided are incorect" });
    }

    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        // issue jwt return user with jwt header
        const jwtToken = issueJwt(user._id);
        delete user.password;

        return res.header("Authorization", jwtToken.token).json(user);
      } else {
        return res.json({ errorMessage: "Credentials provided are incorect" });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        errorMessage: "Sorry, an error occured. Please try again.",
      });
    }
  });

  // registration endpoint for all account types
  authRouter.route("/register").post(async (req, res) => {
    // request body must contain a password and a  username
    try {
      const salt = await bcrypt.genSalt();
      if (req.body.password !== req.body.cPassword) {
        throw new CustomError("Password Mismatch.", "Password Mismatch");
      }
      if (!req.body.password || !req.body.username) {
        throw new CustomError(
          "Password and username required.",
          "Missing Field"
        );
      }

      // check if username already in use
      const userExists = await getUserByUsername(req.body.username);
      if (userExists) {
        return res.status(400).json({ message: "Username already in use" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      User.create({ ...req.body, password: hashedPassword }).then((_res) => {
        const user = _res.toJSON();
        const jwtToken = issueJwt(user._id);
        delete user.password;

        return res.header("Authorization", jwtToken.token).json({
          message: user.username + " account successfully created.",
          success: true,
        });
      });
    } catch (error) {
      console.log(error);
      res.json({ error: error.message, code: error.name });
    }
  });

  authRouter.route("/logout").delete((req, res) => {
    req.logOut();
    res
      .status(200)
      .json({ message: "user succesfully logged out", success: true });
  });

  authRouter
    .route("/currentUser")
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
      console.log("ss: ", req.user);
      return res.status(200).json(req.user);
    });

  return authRouter;
};

module.exports = authRoutes;
