const { Schema, model } = require("mongoose");

const transactionSchema = Schema({
  time: { type: Date },
  response: { type: Object },
});

module.exports = model("Transaction", transactionSchema);
