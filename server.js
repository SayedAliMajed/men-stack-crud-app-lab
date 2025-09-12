// Import core modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Create an Express app instance
const app = express();

// Constants for configuration
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Cars = require('./models/cars.js');

const PORT = 3000;
// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));     // Request logging for development
app.use(express.json());    // Parse JSON bodies




// Routes

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

// Displays a list of all cars
app.get('/cars', async (req, res) => {
  const allCars = await Cars.find();
  
  res.render('cars/index.ejs', {cars: allCars});
});

// Shows a form to create a new car

app.get('/cars/new', (req,res) => {
    res.render('cars/new.ejs');
});


//Creates a new car

app.post('/cars', async (req,res) => {
  await Cars.create(req.body);
  res.redirect('/cars');
});

// Displays a specific car by its ID

app.get('/cars/:carId', async (req, res) => {

  const foundCar = await Cars.findById(req.params.carId);
  res.render('cars/show.ejs', {car: foundCar});
});













app.listen(PORT, () => {
  console.log('Listening on port 3000');
});
