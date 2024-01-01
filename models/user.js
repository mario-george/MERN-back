const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

// instantriating a schema from the Schema class

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  places: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

// collection will be lower case and plural 'users'