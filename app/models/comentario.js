var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ComentarioSchema = new Schema({
    user: { type: String, lowercase: true, required: true },
    content:  { type: String },
    video:    { type: String },
    date:     { type: Date },
    upvotes:  { type: Array }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);