var express    = require('express');
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require("redis")

var User = require('./models/user');
var config = require('./config');

mongoose.connect(config.database);

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
        User.find({ points:  {$gt: req.body.score} }, function (err, users) {
            if (err)
                return res.send(err);
            //update cache
            return res.json({ rank: users.length + 1 });
            }
        );
});
//create user
router.route('/create')
    .post(function(req, res) {
        //check cache
        User.findOne({
            _id: req.body.id
        },function(err, user) {
            if (err)
                return res.send(err);
            if (user != null) {
                //user found
                return res.json({ message: 'User was already found!', success: false });
            } else {
                //create user
                var newUser = new User();
                newUser.name = req.body.username;
                newUser.points = 0;
                newUser.save(function(err,createdUser) {
                        if (err)
                            return res.send(err);
                        return res.json({ userId: createdUser.id, success: true });
                });
            }
        });
});
//update score
router.route('/update')
    .post(function(req, res) {
        User.findOne({
            _id: req.body.id
        },function(err, user) {
            if (err)
                return res.send(err);
            if (user != null) {
                //update score
                user.points = req.body.score;
                user.save(function(err) {
                    if (err)
                        return res.send(err);                   
                    //get rank
                    //check cache
                    User.find({ points:  {$gt: req.body.score} }, function (err, users) {
                        if (err)
                            return res.send(err);
                        //update cache
                        return res.json({ rank: users.length + 1, success: false });
                        }
                    );
                });
            } else {
                //user not found
                return res.json({ message: 'User was not found!', success: false });
            }
        });
});

app.use('/api', router);

app.listen(app.get("port"));
console.log('Magic happens on port ' + app.get("port"));