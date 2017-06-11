var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = require('mongoose').Types.ObjectId; 

var MultimediaShema = new Schema({
    title: { type: String, required: true },
    season: { },
    cover: { type: String },
    videos: [],
    busquedas: { type: Number },
    vistas: { type: Number }
});

MultimediaShema.statics.toggleBlock = function (id, callback) {
    var multi = this;
    multi.findOne({ 'videos._id': ObjectId(id) }).select('videos.$').exec(function(err, doc) {
        if(!err){
            multi.update(
                { 'videos._id': ObjectId(id) },
                { $set: { 'videos.$.block': !doc.videos[0].block } },
                {}, function(error){
                    if(error)
                        return { success: false, message: error };
                    else 
                        callback();
                }
            );
        }
    });
};

module.exports = mongoose.model('Multimedia', MultimediaShema);