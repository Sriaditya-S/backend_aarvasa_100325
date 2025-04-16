const express = require('express');
const router = express.Router();
const commercialWorkspaceSellController = require('../controllers/commercialWorkspaceSellController');

router.post('/post_sell_commercial_workspace', commercialWorkspaceSellController.postSellCommercialWorkspace);
router.post('/all_commercial_workspace_sale_properties', commercialWorkspaceSellController.getAllCommercialWorkspaceSaleProperties);
router.post('/filter_commercial_workspace_sale_properties', commercialWorkspaceSellController.filterCommercialWorkspaceSaleProperties);
router.post('/filter_map_sale_commercial_workspace', commercialWorkspaceSellController.filterMapSaleCommercialWorkspace);

module.exports = router;