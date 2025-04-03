const db = require('../config/firebase');

/**
 * Saves user data to the `login_details` Firestore collection.
 * 
 */
exports.createUser = async (data) => {
    const docRef = await db.collection('login_details').add(data);
    return docRef;
};