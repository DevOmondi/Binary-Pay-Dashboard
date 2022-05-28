const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { CustomError, getUserByUsername } = require("../../utility");

const authRoutes = (Doctor, Patient, Admin) => {
  const authRouter = express.Router();
  const models = { admin: Admin, doctor: Doctor, patient: Patient };

  authRouter.route("/login").post(
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      req.body.accountType === req.user.accountType
        ? res.redirect("/dashboard")
        : res.send(
            "<h1>Sorry credentials are mismatched. Login with correct user level.</h1>"
          );
    }
  );

  // registration endpoint for all account types
  authRouter.route("/register").post(async (req, res) => {
    // request body must contain a password, username and accountType based on account type to be created
    try {
      const salt = await bcrypt.genSalt();
      if (req.body.password !== req.body.cPassword) {
        throw new CustomError("Password Mismatch.", "Password Mismatch");
      }
      if (!req.body.password || !req.body.accountType || !req.body.username) {
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
      const user = new models[req.body.accountType]({
        ...req.body,
        password: hashedPassword,
      });
      user.save((err) => {
        if (err) throw err;
      });
      return res.status(201).redirect("/dashboard");
      // .json({ message: user.username + " account successfully created." });
    } catch (error) {
      res.json({ error: error.message, code: error.name });
    }
  });

  authRouter.route("/logout").delete((req, res) => {
    req.logOut();
    req.redirect("/login");
  });

  authRouter.route("/currentUser").get((req, res) => {
    return res.status(200).json(req.user);
  });

  return authRouter;
};

module.exports = authRoutes;
