const axios = require('axios');

// Function to geocode an address using Google Maps API
async function geocodeAddress(address) {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await axios.get(apiUrl);
  if (response.data.results && response.data.results.length > 0) {
    return response.data.results[0].geometry.location;
  } else {
    throw new Error('Address not found');
  }
}

// Function to calculate distance using Google Distance Matrix API
async function calculateDistance(origins, destinations) {
  const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_API_KEY}&units=metric`;
  const response = await axios.get(apiUrl);
  if (
    response.data.rows &&
    response.data.rows.length > 0 &&
    response.data.rows[0].elements &&
    response.data.rows[0].elements.length > 0
  ) {
    return response.data.rows[0].elements[0].distance.value; // Distance in meters
  } else {
    throw new Error('Distance calculation failed');
  }
}

module.exports = { geocodeAddress, calculateDistance };