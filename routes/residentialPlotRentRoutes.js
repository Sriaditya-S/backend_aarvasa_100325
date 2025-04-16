const express = require('express');
const router = express.Router();
const residentialPlotRentController = require('../controllers/residentialPlotRentController');

router.post('/post_rent_residential_plots', residentialPlotRentController.postRentResidentialPlots);
router.post('/all_residential_rent_properties', residentialPlotRentController.getAllResidentialRentProperties);
router.post('/filter_residential_rent_properties', residentialPlotRentController.filterResidentialRentProperties);
router.post('/filter_map_rent_residential_plots', residentialPlotRentController.filterMapRentResidentialPlots);

module.exports = router;