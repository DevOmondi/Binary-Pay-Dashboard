const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {},
  {
    timestamps: true,
  },
  {
    collection: "transactions",
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
