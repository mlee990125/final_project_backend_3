const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  location: {type: String, default: ''},
  locationDetail: {type: String, default: ''}
});

module.exports = mongoose.model('Address', addressSchema)