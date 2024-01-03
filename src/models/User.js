const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression for alphanumeric characters, underscores, and periods, 3 to 20 characters long
        return /^[a-zA-Z0-9_.]{3,20}$/.test(value);
      },
      message: 'Username must be alphanumeric, may include underscores and periods, and be between 3 and 20 characters long'
    }
  },
  fullName: { type: String },
  password: { type: String, required: true },
  notes: [noteSchema], 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
