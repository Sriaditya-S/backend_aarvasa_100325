const express = require('express');
const router = express.Router();
const commercialPlotController = require('../controllers/commercialPlotController');

router.post('/post_sale_commercial_plots', commercialPlotController.postSaleCommercialPlots);
router.post('/all_commercial_sale_properties', commercialPlotController.getAllCommercialSaleProperties);
router.post('/filter_commercial_sale_properties', commercialPlotController.filterCommercialSaleProperties);
router.post('/filter_map_sale_commercial_plots', commercialPlotController.filterMapSaleCommercialPlots);

module.exports = router;