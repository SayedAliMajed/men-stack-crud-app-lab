const { default: mongoose, model } = require("mongoose");

const carsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Brand: String,
  Year: Date,
  color:String,
  image: String,
  description: { type: String, required: true },
});

const Cars = mongoose.model('Cars', carsSchema);

model.exports = Cars;