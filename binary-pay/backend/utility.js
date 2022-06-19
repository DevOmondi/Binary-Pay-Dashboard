const User = require("./models/userModel");

class CustomError extends Error {
  // generate customized error messages and codes
  constructor(message, name, ...params) {
    super(...params);
    this.name = name;
    this.message = message;
  }
}

const getUserByUsername = async (username) => {
  // check across the three account collections to find user with given username
  const handleError = (err) => (err ? err : null);
  return await User.findOne({ username })
    .then((user) => {
      if (user && user !== undefined) {
        return user;
      }
      return;
    })
    .catch((err) => handleError(err));
};

const getUserByDBId = async (id) => {
  const handleError = (err) => (err ? err : null);
  return await User.findById(id)
    .then((user) => {
      if (user && user !== undefined) {
        return user;
      }
    })
    .catch((err) => handleError(err));
};

const verifyAuth = (req, res, next) => {
  return req.user
    ? next()
    : res.status(401).json({ message: "Sorry! User Unauthorized." });
};

const handleResponseErrors = (res, _err) => {
  // an error handler for internal server errors and databse errors
  console.log(_err);
  res.status(500).json({ errorMessage: "Sorry! An error occured." });
};

module.exports = {
  handleResponseErrors,
  CustomError,
  getUserByDBId,
  getUserByUsername,
  verifyAuth,
};
