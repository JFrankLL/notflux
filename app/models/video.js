var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var VideoShema = new Schema({
    name: { type: String, lowercase: true, required: true },
    path: { type: String, required: true }
});

module.exports = mongoose.model('Video', VideoShema);