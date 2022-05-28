const router = require("express").Router();
const path = require("path");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const authRoutes = require("./api/authRoutes")(User);
const transactionRoutes = require("./api/transactionRoutes")(Transaction);

// api routing
router.use("/auth", authRoutes);
router.use("/api/transaction", transactionRoutes);

// frontend routes
router.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "/static/index.html"))
);

module.exports = router;
