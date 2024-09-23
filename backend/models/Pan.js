// models/Pan.js

const mongoose = require('mongoose');

const panSchema = new mongoose.Schema({
  pan_number: { type: String, required: true },
  dob_match: String,
  pan_active: String,
  first_name: String,
  last_name: String,
  middle_name: String,
  aadhaar_seeding_status: String,
  name: String,
  name_on_card: String,
});

const Pan = mongoose.model('Pan', panSchema);

module.exports = Pan;
