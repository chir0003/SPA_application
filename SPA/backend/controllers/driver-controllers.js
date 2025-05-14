const Driver = require("../models/driver");
const Package = require('../models/package');
const mongoose = require("mongoose");
const admin = require("firebase-admin");

//Get a reference to the private key
const serviceAccount = require("../serviceAccountKey.json");



const db = admin.firestore()

// Collections for counting CRUD operations
const operationCountersRef = db.collection('operationCounters').doc('counters');

async function incrementCounter(operation) {
  let doc = await operationCountersRef.get();
  
  if (!doc.exists) {
      // Initialize the document with all the operation fields
      await operationCountersRef.set({ create: 0, retrieve: 0, update: 0, delete: 0 });
      doc = await operationCountersRef.get();  
  }

  const data = doc.data();
  
  // Ensure the field exists before updating it
  const currentCount = data[operation] !== undefined ? data[operation] : 0;
  
  await operationCountersRef.update({ [operation]: currentCount + 1 });
}


module.exports = {

    addDriver: async function (req, res) {
        try {
            console.log('Received driver data:', req.body);

            const newDriver = new Driver(req.body);
            const savedDriver = await newDriver.save();
            await incrementCounter('create');
            res.json({
                id: savedDriver._id,
                driver_id: savedDriver.driver_id
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
     }
    },
    listDrivers: async function (req, res) {
        try {
        const drivers = await Driver.find().populate('assigned_packages');
        await incrementCounter('retrieve');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},
    deleteDriver : async function (req, res) {
        
        try {
            const { id } = req.params;
    
            // Validate if the provided `id` is a valid MongoDB ObjectID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid driver ID format.' });
            }
    
            let deletedCount = 0;
    
            // Find and delete the driver by MongoDB `_id`
            const driver = await Driver.findByIdAndDelete(id);
    
            if (!driver) {
                return res.status(404).json({ acknowledged: false, deletedCount: 0 });
            }
    
            deletedCount++;
    
            // Delete all packages associated with the deleted driver
            await Package.deleteMany({ driver_id: driver._id });
            await incrementCounter('delete');
    
            res.json({
                acknowledged: true,
                deletedDriverCount: deletedCount,
            });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    },
    updateDriver : async function (req, res) {
        try {
            const { id, driver_licence, driver_department } = req.body;
            const updatedDriver = await Driver.findByIdAndUpdate(
                id, 
                { driver_licence, driver_department }, 
                { new: true }
        
            );
           
    
            if (!updatedDriver) {
                res.json({ status: "ID not found" });
            } else {
                await incrementCounter('update');
                res.json({ status: "Driver updated successfully" });

            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getDriverByDriverId: async function (req, res) {
        try {
            const { driverId } = req.params; // Extract driverId from request parameters
            
            const driver = await Driver.findOne({ driver_id: driverId });

            if (!driver) {
                return res.status(404).json({ message: 'Driver not found' });
            }

            res.json(driver);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getDriverByMongoId: async function (req, res) {
        try {
            const { driverId } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(driverId)) {
                return res.status(400).json({ error: 'Invalid driver ID format' });
            }
    
            const driver = await Driver.findById(driverId);
    
            if (!driver) {
                return res.status(404).json({ message: 'Driver not found' });
            }
    
            res.json({ driver_id: driver.driver_id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }}
};
