const cloudinary = require('../config/cloudinary');

// Function to upload an image
async function uploadImage(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, { public_id: publicId });
    console.log('Image uploaded successfully:', result);
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Function to generate transformed URLs
function getTransformedUrls(publicId) {
  const optimizeUrl = cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
  });

  const autoCropUrl = cloudinary.url(publicId, {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  return { optimizeUrl, autoCropUrl };
}

module.exports = { uploadImage, getTransformedUrls };