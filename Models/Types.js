const mongoose = require('mongoose');
const User = require('./User');

const endUserSchema = new mongoose.Schema({
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    specialization: { type: String, required: true }
});

const hospitalSchema = new mongoose.Schema({
    location: { type: String, required: true },
});

const adminSchema = new mongoose.Schema({
    // Define admin-specific fields if any
});

const EndUser = User.discriminator('EndUser', endUserSchema);
const Hospital = User.discriminator('Hospital', hospitalSchema);
const Admin = User.discriminator('Admin', adminSchema);

module.exports = { EndUser, Hospital, Admin };
