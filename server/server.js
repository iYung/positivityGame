var express    = require('express');
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require("redis")

var User = require('./models/user');
var config = require('./config');

mongoose.connect(config.database,{useMongoClient: true});

//port setup
var port;
if (process.env.NODE_ENV === 'production') {
    port = process.env.PORT || config.serverPort;
} else {
    port = config.serverPort;
}

app.set("port", port);
//allow CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Coantrol-Allow-Headers', 'Content-Type');
  console.log('req made');
  next();
});

var router = express.Router();

////Unauthenticated routes
//------------------------------------------------------------------------------
//get ranking
router.route('/rank')
    .post(function(req, res) {
        //check cache
        User.findOne({
            _id: req.body.id
        },function(err, user) {
            if (err)
                return res.send(err);
            if (user != null) {
                //send ranking
                //save in cache
            } else {
                //user not found
            }
        });
});