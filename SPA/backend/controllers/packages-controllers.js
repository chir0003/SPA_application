const Package = require('../models/package');
const Driver = require('../models/driver');
const admin = require("firebase-admin");
//Get a reference to the private key
const serviceAccount = require("../serviceAccountKey.json");



const db = admin.firestore()

// Collections for counting CRUD operations
const operationCountersRef = db.collection('operationCounters').doc('counters');


async function incrementCounter(operation) {
  let doc = await operationCountersRef.get();
  
  if (!doc.exists) {
      
      await operationCountersRef.set({ create: 0, retrieve: 0, update: 0, delete: 0 });
      doc = await operationCountersRef.get();  // Fetch the document again after creating it
  }

  const data = doc.data();
  
 
  const currentCount = data[operation] !== undefined ? data[operation] : 0;
  
  await operationCountersRef.update({ [operation]: currentCount + 1 });
}


module.exports = {
    addPackage : async function (req, res) {
        try {
            const newPackage = new Package(req.body);
            const savedPackage = await newPackage.save();
            await incrementCounter('create');
            res.json({
                id: savedPackage._id,
                package_id: savedPackage.package_id
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    listPackages : async function (req, res) {
        try {
            const packages = await Package.find().populate('driver_id');// check this later
            await incrementCounter('retrieve');
            res.json(packages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deletePackage : async function (req, res) {
        try {
            const packageId = req.params.id;
        
            const deletedPackage = await Package.findByIdAndDelete(packageId);
            
            if (!deletedPackage) {
                return res.status(404).json({ acknowledged: false, deletedCount: 0 });
            }
        
            const affectedDrivers = await Driver.find({ assigned_packages: packageId });
        
            if (affectedDrivers.length > 0) {
                await Driver.updateMany(
                    { assigned_packages: packageId },
                    { $pull: { assigned_packages: packageId } }
                );
            }
            await incrementCounter('delete');
        
            res.json({
                acknowledged: true,
                deletedCount: 1
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    },

    updatePackage : async function (req, res) {
        try {
            const { package_id, package_destination } = req.body;
            const updatedPackage = await Package.findByIdAndUpdate(
                package_id, 
                { package_destination }, 
                { new: true }
            );
           
    
            if (!updatedPackage) {
                res.json({ status: "Package ID not found" });
            } else {
                await incrementCounter('update');
                res.json({ status: "updated successfully" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPackageByIdFromPackageId: async function (req, res) {
        try {
            const packageId = req.params.package_id; // Get the package_id from request params
            const pkg = await Package.findOne({ package_id: packageId }); // Find the package using the package_id

            if (!pkg) {
                return res.status(404).json({ message: "Package not found" });
            }

            res.json(pkg); // Return the found package
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


};