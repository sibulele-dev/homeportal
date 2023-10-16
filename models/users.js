const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  },
  { collection: "Users" }
); //add Collection name;

module.exports = mongoose.model("User", userSchema);