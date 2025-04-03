const db = require('../config/firebase'); // Firebase configuration
const axios = require('axios'); // Axios for API requests

// Handles posting a residential project
exports.postResidentialProject = async (req, res) => {
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
      zero: 0,
      zero_point_five: 0,
      one: 0,
      one_point_five: 0,
      two: 0,
      two_point_five: 0,
      three: 0,
      three_point_five: 0,
      four: 0,
      four_point_five: 0,
      five: 0,
    };

    // Save to Firestore
    const docRef = await db.collection('RESIDENTIAL_PROJECTS').add(data);
    res.json({ message: 'Residential project added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add residential project' });
  }
};

// Fetches all residential projects
exports.getAllResidentialProjects = async (req, res) => {
  try {
    const snapshot = await db.collection('RESIDENTIAL_PROJECTS').get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching residential projects:', error);
    res.status(500).json({ error: 'Failed to fetch residential projects' });
  }
};

// Filters residential projects
exports.filterResidentialProjects = async (req, res) => {
  try {
    const { state, city, pincode, min, max } = req.body;
    const snapshot = await db.collection('RESIDENTIAL_PROJECTS').get();
    const projects = snapshot.docs.map(doc => doc.data());

    const filtered = projects.filter(project => {
      const price = parseInt(project.totalAmount);
      return (
        project.state === state &&
        project.city === city &&
        project.pincode === pincode &&
        price >= parseInt(min) &&
        price <= parseInt(max)
      );
    });

    res.json({ filtered });
  } catch (error) {
    console.error('Error filtering residential projects:', error);
    res.status(500).json({ error: 'Failed to filter residential projects' });
  }
};

// Filters residential projects by map
exports.filterMapResidentialProjects = async (req, res) => {
  try {
    const { address, range } = req.body;

    // Geocode the address using Google Maps API
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(apiUrl);
    const location = response.data.results[0].geometry.location;

    const snapshot = await db.collection('RESIDENTIAL_PROJECTS').get();
    const projects = snapshot.docs.map(doc => doc.data());

    const nearbyProjects = [];
    for (const project of projects) {
      const projectLat = project.lat;
      const projectLng = project.long;

      // Calculate distance using Google Distance Matrix API
      const distanceApiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.lat},${location.lng}&destinations=${projectLat},${projectLng}&key=${process.env.GOOGLE_MAPS_API_KEY}&units=metric`;
      const distanceResponse = await axios.get(distanceApiUrl);

      if (
        distanceResponse.data.rows &&
        distanceResponse.data.rows.length > 0 &&
        distanceResponse.data.rows[0].elements &&
        distanceResponse.data.rows[0].elements.length > 0
      ) {
        const distanceElement = distanceResponse.data.rows[0].elements[0];
        if (distanceElement.status === 'OK') {
          const distanceInMeters = distanceElement.distance.value;
          if (distanceInMeters <= parseFloat(range)) {
            nearbyProjects.push(project);
          }
        }
      }
    }

    res.json({ nearbyProjects });
  } catch (error) {
    console.error('Error filtering residential projects by map:', error);
    res.status(500).json({ error: 'Failed to filter residential projects by map' });
  }
};