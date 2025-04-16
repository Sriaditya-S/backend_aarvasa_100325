const express = require('express');
const router = express.Router();
const residentialPlotSellController = require('../controllers/residentialPlotSellController');

router.post('/post_sale_residential_plots', residentialPlotSellController.postSaleResidentialPlots);
router.post('/all_residential_sale_properties', residentialPlotSellController.getAllResidentialSaleProperties);
router.post('/filter_residential_sale_properties', residentialPlotSellController.filterResidentialSaleProperties);
router.post('/filter_map_sale_residential_plots', residentialPlotSellController.filterMapSaleResidentialPlots);

module.exports = router;