const { Schema, model } = require("mongoose");

const TokenLogin = new Schema({
  username: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = model('TokenLogin', TokenLogin);
