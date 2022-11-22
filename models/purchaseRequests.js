const { Schema, model } = require("mongoose");

const purchaseRequestSchema = Schema(
  {
    response: { type: Object },
    purchaseBody: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Purchase", purchaseRequestSchema);
