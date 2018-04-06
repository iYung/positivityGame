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
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log('req made');
  next();
});

var router = express.Router();

////Unauthenticated routes
//------------------------------------------------------------------------------
//create user
router.route('/create')
    .post(function(req, res) {
        var newUser = new User();
        newUser.name = req.body.username;
        newUser.points = 0;
        newUser.save(function(err,createdUser) {
                if (err)
                    return res.send(err);
                return res.json({ name: req.body.username, userId: createdUser.id, success: true });
        });
});
//update score
router.route('/update')
    .post(function(req, res) {
        //find current user to update score
        User.findById(
            req.body.id
            ,function(err, user) {
                if (err)
                    return res.send(err);
                if (user != null) {
                    //update score
                    user.points = req.body.score;
                    user.save(function(err) {
                        if (err)
                            return res.send(err);                   
                        //get top 5
                        User.find({}, 'points name', {limit: 5, sort: { points: -1 }}, function (err, top5){
                            if (err)
                                return res.send(err);
                            //get user rank
                            User.find({ points:  {$gt: parseInt(req.body.score)} }, 'points', function (err, users) {
                                if (err)
                                    return res.send(err);
                                var data = { rank: users.length + 1, success: true, top5: top5 };
                                console.log(data);
                                return res.json(data);
                            });
                        });
                        
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