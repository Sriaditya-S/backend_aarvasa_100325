const userModel = require('../models/userModel');


 // now we are handling user signup by 
 // saving user details to Firestore.

exports.signup = async (req, res) => {
    const {
        email,
        password,
        fullName,
        contactNumber,
        countryCode,
        age,
        area,
        pincode,
        state,
        district,
        roadNo,
        panCard,
    } = req.body;

    const data = {
        email,
        password,
        fullName,
        contactNumber,
        countryCode,
        age,
        area,
        pincode,
        state,
        district,
        roadNo,
        panCard,
    };

    try {
        const docRef = await userModel.createUser(data);
        res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};