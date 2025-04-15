const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');


router.post('/filter', propertyController.filter);
router.post('/get_within_range', propertyController.get_within_range);
 
// Define property-related routes
router.post('/post_rental_properties', propertyController.postRentalProperties);
router.post('/all_rent_properties', propertyController.getAllRentProperties);
router.post('/filter_rent_properties', propertyController.filterRentProperties);
router.post('/filter_map_rent_properties', propertyController.filterMapRentProperties);

router.post('/post_sale_properties', propertyController.postSaleProperties);
router.post('/all_sale_properties', propertyController.getAllSaleProperties);
router.post('/filter_sale_properties', propertyController.filterSaleProperties);
router.post('/filter_map_sale_properties', propertyController.filterMapSaleProperties);

module.exports = router;