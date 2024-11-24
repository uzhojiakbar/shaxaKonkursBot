const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  username: String,
  firstName: String,
  lastName: String,
  referalId: { type: String, default: null }, // Asosiy referal ID
  tempReferalId: { type: String, default: null }, // Vaqtinchalik saqlash uchun
});

module.exports = mongoose.model("User", UserSchema);
