const { Schema, model } = require("mongoose");

const ConfirmationRequestSchema = Schema(
  {
    confirmationDetails: { type: Object },
    purchaseBody: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Confirmation", ConfirmationRequestSchema);
