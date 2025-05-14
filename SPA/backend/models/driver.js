const mongoose = require('mongoose');


const driverSchema = new mongoose.Schema({
    driver_id: {
        type: String,
        unique: true,

    },
    driver_name: {
        type: String,
        required: true,
        validate: {
            validator: function(name) {
                return /^[A-Za-z]{3,20}$/.test(name);
            },
            message: "Invalid name."
        }
    },
    driver_department: {
        type: String,
        required: true,
        enum: ["food", "furniture", "electronic"], // Validates against allowed departments
    },
    driver_licence: {
        type: String,
        required: true,
        validate: {
            validator: function(licence) {
                return /^[A-Za-z0-9]{5}$/.test(licence);
            },
            message: "Invalid licence. "
        }
    },
    driver_isActive: {
        type: Boolean,
        default: true,
    },
    driver_createdAt: {
        type: Date,
        default: Date.now,
    },
    assigned_packages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package', // Reference to the Package model
    }]
});

// Pre-save middleware to generate the driver ID
driverSchema.pre('save', function(next) {
    if (!this.driver_id) {
        const randomDigits = Math.floor(Math.random() * 90 + 10);
        const studentIDPart = "34";
        let randomLetters = '';
        for (let i = 0; i < 3; i++) {
            const randomCharCode = Math.floor(Math.random() * 26) + 65;
            randomLetters += String.fromCharCode(randomCharCode);
        }
        this.driver_id = `D${randomDigits}-${studentIDPart}-${randomLetters}`;
    }
    next();
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
