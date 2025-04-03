const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dqhddm7mi',
  api_key: '222323681783653',
  api_secret: 'JYjcMfIJhwySByknWD2z_6B7J8Q',
});

console.log('Cloudinary configured successfully.');

module.exports = cloudinary;