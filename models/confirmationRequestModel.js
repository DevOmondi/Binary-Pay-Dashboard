const { Schema, model } = require("mongoose");

const ConfirmationRequestSchema = Schema({
  confirmationDetails: { type: Object },
  purchaseBody: { type: Object },
});

module.exports = model("Confirmation", ConfirmationRequestSchema);
