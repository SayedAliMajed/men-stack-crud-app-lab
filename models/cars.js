const mongoose= require("mongoose");

const carsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String },
  image: { type: String },
  description: { type: String, required: true },
});

const Cars = mongoose.model('Cars', carsSchema);

module.exports = Cars;