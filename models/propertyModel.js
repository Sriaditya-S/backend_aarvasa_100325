const db = require('../config/firebase');
const axios = require('axios');

// Adds a property to Firestore
exports.addProperty = async (collectionName, data) => {
    const docRef = await db.collection(collectionName).add(data);
    return { id: docRef.id };
};

// Fetches all properties from Firestore
exports.getAllProperties = async (collectionName) => {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Filters properties based on criteria
exports.filterProperties = async (collectionName, filters) => {
    const { state, city, pincode, min, max } = filters;
    const snapshot = await db.collection(collectionName).get();
    const properties = snapshot.docs.map(doc => doc.data());
    return properties.filter(property => {
        const price = parseInt(property.totalAmount);
        return (
            property.state === state &&
            property.city === city &&
            property.pincode === pincode &&
            price >= parseInt(min) &&
            price <= parseInt(max)
        );
    });
};

// Filters properties by map location
exports.filterMapProperties = async (collectionName, { address, range }) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(apiUrl);
    const location = response.data.results[0].geometry.location;

    const snapshot = await db.collection(collectionName).get();
    const properties = snapshot.docs.map(doc => doc.data());

    const nearby = [];
    for (const property of properties) {
        const distanceApiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.lat},${location.lng}&destinations=${property.lat},${property.long}&key=${process.env.GOOGLE_MAPS_API_KEY}&units=metric`;
        const distanceResponse = await axios.get(distanceApiUrl);
        const distance = distanceResponse.data.rows[0].elements[0].distance.value;
        if (distance <= range) {
            nearby.push(property);
        }
    }
    return nearby;
};