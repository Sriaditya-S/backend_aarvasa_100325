const express = require('express');
const router = express.Router();
const commercialPlotController = require('../controllers/commercialPlotController');

router.post('/post_sale_commercial_plots', commercialPlotController.postSaleCommercialPlots);

module.exports = router;