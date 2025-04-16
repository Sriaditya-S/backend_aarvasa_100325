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
app.use(cors({ origin: '*' }));

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
const commercialPlotRoutes = require('./routes/commercialPlotRoutes');
const commercialPlotRentRoutes = require('./routes/commercialPlotRentRoutes');
const residentialPlotRentRoutes = require('./routes/residentialPlotRentRoutes');
const residentialPlotSellRoutes = require('./routes/residentialPlotSellRoutes');
const commercialWorkspaceSellRoutes = require('./routes/commercialWorkspaceSellRoutes');

// Use modularized routes
app.use('/properties', propertyRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);
app.use('/agents', agentRoutes);
app.use('/ratings', ratingRoutes);
app.use('/consultations', consultationRoutes);
app.use('/residential-projects', residentialProjectRoutes);
app.use('/commercial-plots',commercialPlotRoutes);
app.use('/commercial-plots-rent', commercialPlotRentRoutes);
app.use('/residential-plots-rent', residentialPlotRentRoutes);
app.use('/residential-plots-sell', residentialPlotSellRoutes);
app.use('/commercial-workspace-sell', commercialWorkspaceSellRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});