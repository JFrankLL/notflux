var express     = require('express');
var app         = express();
var port        = process.env.port || 8080;
var morgan      = require('morgan'); // middleware manager
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var router      = express.Router();
var appRoutes   = require('./app/routes/api')(router);// param!
var path        = require('path');
var passport    = require('passport');
var social      = require('./app/passport/passport')(app, passport);

app.use(morgan('dev')); // log every request into the server 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.Promise = global.Promise;
// cholo's: 104.237.131.97           vm's: 192.168.0.17
mongoose.connect('mongodb://192.168.0.16:27017/tutorial', function(err) {
    if (err)
        console.log('Not Connected to the database: ' + err);
    else
        console.log('Succesfully connected to MongoDB');
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
    console.log('Running the sever on port: ' + port);
});