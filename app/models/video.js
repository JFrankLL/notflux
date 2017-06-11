var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var VideoShema = new Schema({
    name: { type: String, lowercase: true, required: true },
    path: { type: String, required: true },
    cover: { type: String, required: true},
    vistas: { type: Number },
    block: { type: Boolean }
});

module.exports = mongoose.model('Video', VideoShema);