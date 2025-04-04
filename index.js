require('dotenv').config();
let express = require('express');
const nodemailer = require("nodemailer");
let app = express();
let bodyParser = require('body-parser');
let path = require('path');
let cors = require('cors');

// Import modularized configurations and utilities
const cloudinary = require('./config/cloudinary');
const { uploadImage, getTransformedUrls } = require('./utils/cloudinaryUtils');
const firebaseWebApp = require('./config/firebaseWebApp');
const { geocodeAddress, calculateDistance } = require('./utils/geocodeUtils');

// Middleware
app.use(cors({
    origin: 'https://frontendaarvasa100325.vercel.app', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://frontendaarvasa100325.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/base.html'));
});

// Import modularized routes
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const agentRoutes = require('./routes/agentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const residentialProjectRoutes = require('./routes/residentialProjectRoutes');

// Use modularized routes
app.use('/properties', propertyRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);
app.use('/agents', agentRoutes);
app.use('/ratings', ratingRoutes);
app.use('/consultations', consultationRoutes);
app.use('/residential-projects', residentialProjectRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});