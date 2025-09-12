// Import core modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Create an Express app instance
const app = express();

// Configure multer for file uploads 
const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true});
    cb(null, uploadPath);
  },
  filename: (req,file,cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload= multer({storage:storage});

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images



// Routes

app.get('/', async (req, res) => {
  res.render('index.ejs');
});

// Displays a list of all cars
app.get('/cars', async (req, res) => {
  const allCars = await Cars.find();
  res.render('cars/index.ejs', { cars: allCars });
});

// Shows a form to create a new car
app.get('/cars/new', (req, res) => {
  res.render('cars/new.ejs');
});

// Creates a new car (with image upload @ "image")
app.post('/cars', upload.single('image'), async (req, res) => {
  // If file uploaded, save path, otherwise don't add image prop
  const carData = req.body;
  if (req.file) {
    carData.image = '/uploads/' + req.file.filename;
  }
  await Cars.create(carData);
  res.redirect('/cars');
});

// Displays a specific car by its ID
app.get('/cars/:carId', async (req, res) => {
  const foundCar = await Cars.findById(req.params.carId);
  res.render('cars/show.ejs', { car: foundCar });
});

// Delete car
app.delete('/cars/:carId', async (req, res) => {
  await Cars.findByIdAndDelete(req.params.carId);
  res.redirect('/cars');
});









app.listen(PORT, () => {
  console.log('Listening on port 3000');
});
