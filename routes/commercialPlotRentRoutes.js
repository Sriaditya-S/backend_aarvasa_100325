const express = require('express');
const router = express.Router();
const commercialPlotRentController = require('../controllers/commercialPlotRentController');

router.post('/post_rent_commercial_plots', commercialPlotRentController.postRentCommercialPlots);
router.post('/all_commercial_rent_properties', commercialPlotRentController.getAllCommercialRentProperties);
router.post('/filter_commercial_rent_properties', commercialPlotRentController.filterCommercialRentProperties);
router.post('/filter_map_rent_commercial_plots', commercialPlotRentController.filterMapRentCommercialPlots);

module.exports = router;