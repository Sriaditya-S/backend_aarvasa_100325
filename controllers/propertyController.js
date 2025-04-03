const db = require('../config/firebase'); // Firebase configuration
const propertyModel = require('../models/propertyModel'); // Property model for database interactions
const axios = require('axios'); // Axios for API requests

// Handles posting rental properties
exports.postRentalProperties = async (req, res) => {
  try {
    const { Url } = req.body;

    // Geocode the address using Google Maps API
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      Url
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(apiUrl);
    const location = response.data.results[0].geometry.location;

    // Prepare data for Firestore
    const data = {
      ...req.body,
      lat: location.lat,
      long: location.lng,
    };

    // Save to Firestore
    const docRef = await db.collection('RENT_PROPERTIES').add(data);
    res.json({ message: 'Property added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add property' });
  }
};

// Fetches all rental properties
exports.getAllRentProperties = async (req, res) => {
  try {
    const properties = await propertyModel.getAllProperties('RENT_PROPERTIES');
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Filters rental properties
exports.filterRentProperties = async (req, res) => {
  try {
    const filtered = await propertyModel.filterProperties('RENT_PROPERTIES', req.body);
    res.json({ filtered });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter properties' });
  }
};

// Filters rental properties by map
exports.filterMapRentProperties = async (req, res) => {
  try {
    const nearby = await propertyModel.filterMapProperties('RENT_PROPERTIES', req.body);
    res.json({ nearby });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter properties by map' });
  }
};

// Handles posting sale properties
exports.postSaleProperties = async (req, res) => {
  try {
    const data = await propertyModel.addProperty('BUY_PROPERTIES', req.body);
    res.json({ message: 'Property added successfully', id: data.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add property' });
  }
};

// Fetches all sale properties
exports.getAllSaleProperties = async (req, res) => {
  try {
    const properties = await propertyModel.getAllProperties('BUY_PROPERTIES');
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Filters sale properties
exports.filterSaleProperties = async (req, res) => {
  try {
    const filtered = await propertyModel.filterProperties('BUY_PROPERTIES', req.body);
    res.json({ filtered });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter properties' });
  }
};

// Filters sale properties by map
exports.filterMapSaleProperties = async (req, res) => {
  try {
    const nearby = await propertyModel.filterMapProperties('BUY_PROPERTIES', req.body);
    res.json({ nearby });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter properties by map' });
  }
};