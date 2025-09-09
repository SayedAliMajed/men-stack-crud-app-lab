const { default: mongoose, model } = require("mongoose");

const carsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
});

const Cars = mongoose.model('Cars', carsSchema);

model.exports = Cars;