const db = require('../config/firebase'); // Firebase configuration
const propertyModel = require('../models/propertyModel'); // Property model for database interactions
const axios = require('axios'); // Axios for API requests

// Function to get filtered properties based on filters from the request body
exports.filter = async (req, res) => {
  const filters = req.body; // Get the filters from the request body
  console.log("Received filters:", filters);

  try {
    const filteredData = await getFilteredData(filters);
    res.json(filteredData); // Send filtered data back as response
  } catch (error) {
    console.error("Error filtering data:", error);
    res.status(500).send('Server error');
  }
};

//function to get list of nearby properties based on filters as a JSON response
exports.get_within_range = async (req, res) => {
  try {
    const { address, range } = req.body;

    // Validate input
    if (!address || !range) {
      return res.status(400).json({ error: 'Address and range are required' });
    }

    console.log(`Address: ${address}, Range: ${range}`);

    // Geocode the address using Google Maps API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const location = geocodeResponse.data.results[0].geometry.location;
    const userLat = location.lat;
    const userLng = location.lng;

    console.log(`User Location: Latitude: ${userLat}, Longitude: ${userLng}`);

    // Fetch properties from Firestore
    const propertiesSnapshot = await db.collection('propertyDetails').get();
    const properties = propertiesSnapshot.docs.map((doc) => doc.data());

    if (!properties || properties.length === 0) {
      return res.status(404).json({ error: 'No properties found' });
    }

    // Prepare destinations for Distance Matrix API
    const destinations = properties
      .map((property) => `${property.latitude},${property.longitude}`)
      .join('|');

    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLat},${userLng}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_API_KEY}&units=metric`;
    const distanceMatrixResponse = await axios.get(distanceMatrixUrl);

    if (!distanceMatrixResponse.data.rows || distanceMatrixResponse.data.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to calculate distances' });
    }

    const distances = distanceMatrixResponse.data.rows[0].elements;

    // Filter properties within the specified range
    const nearbyProperties = properties.filter((property, index) => {
      const distanceElement = distances[index];
      if (distanceElement.status === 'OK') {
        const distanceInMeters = distanceElement.distance.value;
        return distanceInMeters <= parseFloat(range);
      }
      return false;
    });

    console.log(`Nearby Properties: ${nearbyProperties.length}`);
    res.json({ nearbyProperties });
  } catch (error) {
    console.error('Error in get_within_range:', error);
    res.status(500).json({ error: 'Failed to fetch nearby properties', details: error.message });
  }
};


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