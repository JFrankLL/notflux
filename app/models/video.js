var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var VideoShema = new Schema({
    name: { type: String, required: true },
    path: { type: String, required: true }
});

VideoShema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('Video', VideoShema);