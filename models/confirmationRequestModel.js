const { Schema, model } = require("mongoose");

const ConfirmationRequestSchema = Schema({
  confirmationDetails: { type: Object },
});

module.exports = model("Confirmation", ConfirmationRequestSchema);
