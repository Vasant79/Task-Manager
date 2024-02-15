const { default: mongoose } = require("mongoose");

const guestSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Guest = mongoose.model("Guest", guestSchema);
module.exports = { Guest };
