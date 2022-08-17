const { Schema, model } = require("mongoose");

const transactionSchema = Schema({
  date: { type: Date },
  accountNumber: { type: String },
  amount: { type: String },
  response: { type: Object },
  statusComplete: { type: Boolean },
});

module.exports = model("Transaction", transactionSchema);
