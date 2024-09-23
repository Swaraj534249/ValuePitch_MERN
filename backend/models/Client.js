const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  contactInformation: { type: String, required: true },
});

module.exports = mongoose.model('Client', clientSchema);
