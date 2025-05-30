const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  passkey: Object,
});


module.exports = mongoose.model('User', UserSchema);
