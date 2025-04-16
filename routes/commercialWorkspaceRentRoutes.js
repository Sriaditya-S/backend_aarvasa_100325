const express = require('express');
const router = express.Router();
const commercialWorkspaceRentController = require('../controllers/commercialWorkspaceRentController');

router.post('/post_rent_commercial_workspace', commercialWorkspaceRentController.postRentCommercialWorkspace);
router.post('/all_commercial_workspace_rent_properties', commercialWorkspaceRentController.getAllCommercialWorkspaceRentProperties);
router.post('/filter_commercial_workspace_rent_properties', commercialWorkspaceRentController.filterCommercialWorkspaceRentProperties);
router.post('/filter_map_rent_commercial_workspace', commercialWorkspaceRentController.filterMapRentCommercialWorkspace);

module.exports = router;