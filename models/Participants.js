const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  telegramId: { type: Number },
  username: String,
  firstName: String,
  lastName: String,
});

module.exports = mongoose.model("Participant", participantSchema);
