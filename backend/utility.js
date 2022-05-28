const models = {
  doctor: require("./models/doctorModel"),
  patient: require("./models/patientModel"),
  admin: require("./models/adminModel"),
};

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
  let _user;
  const searchInCategory = async (category, username) => {
    const handleError = (err) => (err ? err : null);
    await models[category]
      .findOne({ username })
      .then((user) => {
        if (user && user !== undefined) {
          _user = user;
        }
        return _user;
      })
      .catch((err) => handleError(err));
  };

  const isPatient = searchInCategory("patient", username);
  const isDoctor = searchInCategory("doctor", username);
  const isAdmin = await searchInCategory("admin", username);

  return Promise.all([isAdmin, isPatient, isDoctor]).then((results) => {
    return _user;
  });
};

const getUserByDBId = async (id) => {
  // check across the three account collections to find user with given id
  let _user;
  const searchInCategory = async (category, id) => {
    const handleError = (err) => (err ? err : null);
    await models[category]
      .findById(id)
      .then((user) => {
        if (user && user !== undefined) {
          _user = user;
        }
      })
      .catch((err) => handleError(err));
    return _user;
  };

  const isPatient = searchInCategory("patient", id);
  const isDoctor = searchInCategory("doctor", id);
  const isAdmin = searchInCategory("admin", id);
  return Promise.all([isAdmin, isPatient, isDoctor]).then((results) => {
    return _user;
  });
};

const verifyAdmin = (req, res, next) => {
  return !req.user || (res.user && req.user.accountType !== "admin")
    ? res.status(401).json({ message: "Sorry! User Unauthorized." })
    : next();
};

const verifyDoctor = (req, res, next) => {
  return !req.user || (res.user && req.user.accountType !== "doctor")
    ? res.status(401).json({ errorMessage: "Sorry! User Unauthorized." })
    : next();
};

const verifyPatient = (req, res, next) => {
  return !req.user || (res.user && req.user.accountType !== "patient")
    ? res.status(401).json({ errorMessage: "Sorry! User Unauthorized." })
    : next();
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
  verifyAdmin,
  verifyDoctor,
  verifyPatient,
};
