const { Schema, model } = require("mongoose");

const transactionSchema = Schema(
  {
    date: { type: Date },
    accountNumber: { type: String },
    amount: { type: String },
    response: { type: Object },
    statusCompleted: { type: Boolean },
    details: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Transaction", transactionSchema);
