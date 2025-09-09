// Import core modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

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
app.use(morgan('dev'));     // Request logging for development
app.use(express.json());    // Parse JSON bodies


// Routes

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

// Post (add a new car)

app.get('/cars/new', (req,res) => {
    res.render('cars/new.ejs');
});














app.listen(PORT, () => {
  console.log('Listening on port 3000');
});
