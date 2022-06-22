const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { CustomError, getUserByUsername } = require("../../utility");

const authRoutes = (User) => {
  const authRouter = express.Router();

  authRouter.route("/login").post(
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/",
    }),
   /* (req, res) => {
      req.body.accountType === req.user.accountType
        ? res.redirect("/dashboard")
        : res.send(
            "<h1>Sorry credentials are mismatched. Login with correct user level.</h1>"
          );
    }*/
  );

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
      const user = new User({
        ...req.body,
        password: hashedPassword,
      });
      user.save((err) => {
        if (err) throw err;
      });
      return res.status(201).json({
        message: user.username + " account successfully created.",
        success: true,
      });
    } catch (error) {
      res.json({ error: error.message, code: error.name });
    }
  });

  authRouter.route("/logout").delete((req, res) => {
    req.logOut();
    res
      .status(200)
      .json({ message: "user succesfully logged out", success: true });
  });

  authRouter.route("/currentUser").get((req, res) => {
    return res.status(200).json(req.user);
  });

  return authRouter;
};

module.exports = authRoutes;
