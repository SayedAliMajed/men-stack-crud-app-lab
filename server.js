const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');

dotenv.config();

const app = express();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Cars = require('./models/cars.js');

const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes

app.get('/', async (req, res) => {
  res.render('index.ejs');
});

app.get('/cars', async (req, res) => {
  const allCars = await Cars.find();
  res.render('cars/index.ejs', { cars: allCars });
});

app.get('/cars/new', (req, res) => {
  res.render('cars/new.ejs');
});

// Create new car with multer upload
app.post('/cars', upload.single('image'), async (req, res) => {
  const carData = req.body;
  if (req.file) {
    carData.image = '/uploads/' + req.file.filename;
  }
  await Cars.create(carData);
  res.redirect('/cars');
});

app.get('/cars/:carId', async (req, res) => {
  const foundCar = await Cars.findById(req.params.carId);
  res.render('cars/show.ejs', { car: foundCar });
});

// Edit car form
app.get('/cars/:carId/edit', async (req, res) => {
  const foundCar = await Cars.findById(req.params.carId);
  res.render('cars/edit.ejs', { car: foundCar });
});

// Update car - accepts form data, optional new image upload
app.put('/cars/:carId', upload.single('image'), async (req, res) => {
  const carData = req.body;
  if (req.file) {
    carData.image = '/uploads/' + req.file.filename;
  }
  await Cars.findByIdAndUpdate(req.params.carId, carData, { new: true });
  res.redirect(`/cars/${req.params.carId}`);
});

// Delete car
app.delete('/cars/:carId', async (req, res) => {
  await Cars.findByIdAndDelete(req.params.carId);
  res.redirect('/cars');
});

app.listen(PORT, () => {
  console.log('Listening on port 3000');
});
