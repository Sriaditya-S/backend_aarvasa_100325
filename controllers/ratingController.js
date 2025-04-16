const db = require('../config/firebase'); // Firebase configuration

/**
 * Handles property rating updates.
 */
exports.rateProperty = async (req, res) => {
  try {
    const { c, a, rt } = req.body;

    // Map rating types to Firestore collections
    const collectionMap = {
      sale_properties_rating: 'BUY_PROPERTIES',
      sale_residential_plots_rating: 'residential_plots_sell',
      residential_projects_rating: 'RESIDENTIAL_PROJECTS',
      rent_residential_plots_rating: 'RESIDENTIAL_PLOTS',
      sale_commercial_plots_rating: 'commercial_plots_sell',
      rent_commercial_plots_rating: 'COMMERCIAL_PLOTS',
      sale_commercial_workspace_rating: 'commercial_work_spaces_sell',
      rent_commercial_workspace_rating: 'COMMERCIAL_WORKSPACES',
      rent_properties_rating: 'RENT_PROPERTIES', 
    };

    const collectionName = collectionMap[c];
    if (!collectionName) return res.status(400).json({ message: 'Invalid property type' });

    // Fetch the document
    const docRef = db.collection(collectionName).doc(a.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Property not found' });

    const propertyData = doc.data();
    const ratingField = getRatingField(rt);

    if (!ratingField) return res.status(400).json({ message: 'Invalid rating value' });

    // Increment the rating count
    const updatedValue = (propertyData[ratingField] || 0) + 1;
    await docRef.update({ [ratingField]: updatedValue });

    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Failed to update rating', error: error.message });
  }
};

/**
 * Maps the rating value to the corresponding Firestore field.
 */
function getRatingField(rating) {
  const ratingMap = {
    0: 'zero',
    0.5: 'zero_point_five',
    1: 'one',
    1.5: 'one_point_five',
    2: 'two',
    2.5: 'two_point_five',
    3: 'three',
    3.5: 'three_point_five',
    4: 'four',
    4.5: 'four_point_five',
    5: 'five',
  };
  return ratingMap[rating];
}