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

module.export = mongoose.model("Transaction", transactionSchema);
