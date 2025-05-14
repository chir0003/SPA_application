const express = require('express');
const router = express.Router();
const packageController = require("../controllers/packages-controllers");

router.post('/add', packageController.addPackage);

router.get('/', packageController.listPackages);

router.delete('/:id', packageController.deletePackage);

router.get('/getByPackageId/:package_id', packageController.getPackageByIdFromPackageId);




router.put('/update', packageController.updatePackage);

module.exports = router;