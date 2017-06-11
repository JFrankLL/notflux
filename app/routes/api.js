var User        = require('../models/user.js');
var Video       = require('../models/video.js');
var Multimedia  = require('../models/multimedia.js');
var jwt         = require('jsonwebtoken');
var secret      = 'harrypotter';
var fs          = require('fs');
var path        = require('path');
var ObjectId    = require('mongoose').Types.ObjectId; 

module.exports = function(router) {
    var app = this;
    // http://localhost:8080/api/users
    // USER REGISTRATION ROUTE
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' ||
            req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            user.save(function(err) {
                if (err) {
                    if(err.errors != null) {
                        if (err.errors.name) { // Incorrect name 'video/mp4'
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.email) { // Incorrect email 'video/mp4'
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) { // Incorrect username 'video/mp4'
                            res.json({ success: false, message: err.errors.username.message });
                        } else if (err.errors.password) { // Incorrect password 'video/mp4'
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        } 
                    } else if(err) {
                        //res.json({  success: false, message: err});
                        if (err.code == 11000) {
                            res.json({ success: false, message: 'Username or email already taken' });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    res.json({ success: true, message: 'user created!' });
                }
            });    
        }
    });
    // USER LOGIN ROUTE
    // http://localhost:8080/api/authenticate
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password tipo').exec(function(err, user) {
            if (err) throw err;

            if (!user || !req.body.password) { // given user null
                res.json({ success: false, message: "Could not authenticate user."});
            } else if (user) {
                var validPassword = false;
                if(req.body.password) { // password not null
                    validPassword = user.comparePassword(req.body.password);
                } else { // given password null
                    res.json({ success: false, message: "No password provided."});
                }
                if(!validPassword) { // invalid password
                    res.json({ success: false, message: "Could not authenticate password." });
                } else { // success
                    var token = jwt.sign({ username: user.username, email: user.email, tipo: user.tipo }, secret, { expiresIn: '24h' });
                    res.json({ success: true, message: "User authenticated!", token: token });
                }
            }
        });
    });
    // STREAM A VIDEO
    // http://localhost:8080/api/stream?search=
    router.get('/stream/:search?', function(req, res) {
        //
        var value;
        if(!req.query.search) {
            return res.json({ success: false, message: 'Search value not given.' });
        } else {
            value = req.query.search;
        }

        // value SEARCH IN MONGO FOR THAT VIDEO
        console.log('buscando: '+value);
        Video.findOne({ _id: ObjectId(value) }).select('path').exec(function (err, video) {
            if(err){ 
                return res.json({ success: false, message: err });
            } else {
                if(video) {
                    // Stream
                    path = video.path;
                    console.log(path);
                    if(typeof path != "undefined") {
                        // Vistas ++
                        Video.update(
                            { path: video.path },
                            { $inc: { vistas: 1 } },
                            {},
                            function(error){
                                console.log(error);
                            }
                        );
                        // Stremear
                        return streamear(req, res, path);
                    }
                    else
                        return res.json({ success: false, message: err });
                }else
                    return res.json({ success: false, message: err });
            }
        });
        
    });
    // GET IMG COVER
    // http:localhost:8080/api/getImg?img_name=
    router.get('/getImg/:img_name?', function(req, res){
        
        var value = "no hay";
        if(!req.query.img_name)
            return res.json({ success: false, message: 'Imagen no econtrada.' });
        else
            value = req.query.img_name;

            console.log(value);
        fs.readFile(value, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
    });
    // GET VIDEO LIST
    // http:localhost:8080/api/getList?search=
    router.get('/getList/:search?', function(req, res) {
        var value;
        if(!req.query.search)
            return res.json({ success: false, message: 'Search value not given.' });
        else
            value = req.query.search;
        
        // SEARCH IN MONGO FOR THAT NAME KEY VALUE
        var path = "";
        //console.log('buscandoLista con: '+value);
        //
        // obtencion
        Multimedia.find({ title: { '$regex': value, '$options' : 'i' } })
        .select('title season videos cover busquedas').exec(function (err, docs) {
            if(err){ 
                return res.json({ success: false, message: err });
            }

            if(docs) {
                docs.forEach(function(doc){
                    Multimedia.update(
                        { title: doc.title },
                        { $inc: { busquedas: 1 } },
                        { "multi": true },
                        function(error){
                            console.log(error);
                        }
                    );
                    doc.videos = doc.videos.filter(function(el){ return el.block !== true; });
                });
                return res.json(docs);
            }else
                return res.json({ success: false, message: err });
        });
        
    });
    // GET VIDEO LIST2
    // http:localhost:8080/api/getList2?search=
    router.get('/getList2/:search?', function(req, res) {
        var value;
        if(!req.query.search)
            return res.json({ success: false, message: 'Search value not given.' });
        else
            value = req.query.search;
        
        var path = "";
        Multimedia.findOne({ title: { '$regex': value, '$options' : 'i' } })
        .select('title season videos cover busquedas').exec(function (err, doc) {
            if(err){ 
                return res.json({ success: false, message: err });
            }
            //console.log(doc);
            if(doc) {
                return res.json(doc);
            }else
                return res.json({ success: false, message: err });
        });
        
    });
    // GET CERTAIN MULTIMEDIA ???
    // http:localhost:8080/api/getMulti?search=
    router.get('/getMulti/:search?', function(req, res) {
        var value;
        if(!req.query.search)
            return res.json({ success: false, message: 'Search value not given.' });
        else
            value = req.query.search;
        // SEARCH IN MONGO FOR THAT NAME KEY VALUE
        var path = "";
        // obtencion
        Multimedia.find({ title: { '$regex': value, '$options': 'i' } })
        .select('title season cover busquedas videos').exec(function(err, docs) {
            if(err){ 
                return res.json({ success: false, message: err });
            }
            if(docs) {
                return res.json(docs);
            }else
                return res.json({ success: false, message: err });
        });
    });
    // BLOCK VIDEO BY id
    // http:localhost:8080/api/block?id=
    router.get('/block/:id?', function(req, res) {
        var vid_id;
        if(!req.query.id)
            return res.json({ success: false, message: 'Search value not given.' });
        else
            vid_id = req.query.id;
        // BLOCK
        Multimedia.toggleBlock(vid_id, function(){
            // Return List
            Multimedia.find({ 'videos._id': ObjectId(vid_id) }).exec(function(err, docs) {
                if(err)
                    res.json({ success: false });
                res.send(docs);
            });
        });
    });
    // MIDDLEWARE
    router.use(function (req, res, next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token) {
            // verify token
            jwt.verify(token, secret, function(err, decoded){
                if(err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided'});
            //next();
        }
    });//*/
    // GET USER INFO
    // http://localhost:8080/api/me
    router.post('/me', function(req, res) {
        res.send(req.decoded);
    });
    return router;
};
 
////////////////////////////////////////////////////////////////////////////////////////
var streamear = function(req, res, path) {
    var stat = fs.statSync(path);
    var total = stat.size;
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        //console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
        var porc = 100*start/end;
        console.log('Progress: ' + porc.toFixed(2) + '%');

        var file = fs.createReadStream(path, {start: start, end: end});
        res.writeHead(206, { 
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
            'Accept-Ranges': 'bytes', 
            'Content-Length': chunksize, 
            'Content-Type': 'video/mp4',
            'codecs': 'theora, vorbis'
        });
        file.pipe(res);
    } else {
        console.log('ALL: ' + total/1000/1000 + ' MB');
        res.writeHead(200, { 
            'Content-Length': total,
            'Content-Type': 'video/mp4',
            'codecs': 'theora, vorbis'
        });
        fs.createReadStream(path).pipe(res);
    }
};

//type='video/x-matroska' codecs='theora, vorbis'