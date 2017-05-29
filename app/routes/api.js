var User        = require('../models/user.js');
var Video       = require('../models/video.js');
var jwt         = require('jsonwebtoken');
var secret      = 'harrypotter';
var fs          = require('fs');
var path        = require('path');

module.exports = function(router) {
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
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if (err) throw err;

            if (!user || !req.body.password) { // given user null
                res.json({ success: false, message: "Could not authenticate user."});
            } else if (user) {
                //var validPassword;
                if(req.body.password) { // password not null
                    var validPassword = user.comparePassword(req.body.password);
                } else { // given password null
                    res.json({ success: false, message: "No password provided."});
                }
                if(!validPassword) { // invalid password
                    res.json({ success: false, message: "Could not authenticate password." });
                } else { // success
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
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

        // FIXME: value SEARCH IN MONGO FOR THAT VIDEO
        console.log('buscando: '+value);
        Video.findOne({ name: {'$regex': ''+value+''} }).select('path').exec(function (err, video) {
            if(err){ 
                return res.json({ success: false, message: err });
            } else {
                if(video) {
                    path = video.path;
                    console.log(path);
                    if(typeof path != "undefined")
                        return streamear(req, res, path);
                    else
                        return res.json({ success: false, message: err });
                }else
                    return res.json({ success: false, message: err });
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
        console.log('buscandoLista con: '+value);
        Video.find({ name: {'$regex': ''+value+''} }).select('name _id').exec(function (err, docs) {
            if(err){ 
                return res.json({ success: false, message: err });
            } else {
                if(docs) {
                    //TODO: IMPLEMENT SOME SORT OF [video ID] AND SEND IT TO THE FRONT-END, SO IT CAN 
                    // RESEND IT TO THE BACK-END AND GET A STREAM REQUEST OF IT.
                    //console.log(docs);
                    return res.json(docs);
                }else
                    return res.json({ success: false, message: err });
            }
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