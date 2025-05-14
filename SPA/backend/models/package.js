const mongoose = require('mongoose');


const packageSchema = new mongoose.Schema({
    package_id: {
        type: String,
        unique: true,

    },
    package_title: {
        type: String,
        required: true,
        validate: {
            validator: function(title) {
                return /^[A-Za-z0-9]{3,15}$/.test(title);
            },
            message: "Invalid package title. "
        }
    },
    package_weight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number.']
    },
    package_destination: {
        type: String,
        required: true,
        validate: {
            validator: function(destination) {
                return /^[A-Za-z0-9\s]{5,15}$/.test(destination);
            },
            message: "Invalid package destination. "
        }
    },
    description: {
        type: String,
        default: "",
    },
    isAllocated: {
        type: Boolean,
        default: false,
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Pre-save middleware to generate the package ID
packageSchema.pre('save', function(next) {
    if (!this.package_id) {
        const randomLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                              String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const initials = "CK";
        const randomDigits = Math.floor(100 + Math.random() * 900); 
        this.package_id = `P${randomLetters}-${initials}-${randomDigits}`;
    }
    next();
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
