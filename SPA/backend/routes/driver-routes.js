const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver-controllers');


router.post('/add', driverController.addDriver);


router.get('/', driverController.listDrivers);

router.delete('/:id', driverController.deleteDriver);

router.put('/update', driverController.updateDriver);

router.get('/driverid/:driverId', driverController.getDriverByDriverId);
router.get('/driverMongoid/:driverId', driverController.getDriverByMongoId);

module.exports = router;