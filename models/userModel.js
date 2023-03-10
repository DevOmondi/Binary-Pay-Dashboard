const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
