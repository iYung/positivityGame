var express    = require('express');
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require("redis");

var User = require('./models/user');

//prod vs dev setup
var port;
if (process.env.NODE_ENV === 'production') {
    port = process.env.PORT || process.env.SERVER_PORT;
} else {
    var result = require('dotenv').config();
    console.log(result.parsed);
    console.log(process.env.SERVER_PORT);
    port = process.env.SERVER_PORT;
}

//redis setup
var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL, {no_ready_check: true});
client.auth(process.env.REDIS_PASS, function (err) {
    if (err) throw err;
});
client.on('connect', function() {
    console.log('Connected to Redis');
});

mongoose.connect(process.env.DB_LINK);

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
                        client.get('top5', function (err, cachedTop5) {
                            if (cachedTop5) {
                                var top5 = JSON.parse(cachedTop5);
                                client.get(req.body.score, function (err, rank) {
                                    if (rank) {
                                        var data = { rank: rank, success: true, top5: top5 };
                                        console.log(data);
                                        return res.json(data);
                                    } else {
                                        //get user rank
                                        User.find({ points:  {$gt: parseInt(req.body.score)} }, 'points', function (err, users) {
                                            if (err)
                                                return res.send(err);
                                            //update cache
                                            client.set(req.body.score, users.length + 1, 'EX', 600);
                                            var data = { rank: users.length + 1, success: true, top5: top5 };
                                            console.log(data);
                                            return res.json(data);
                                        });
                                    }
                                });
                            } else {
                                User.find({}, 'points name', {limit: 5, sort: { points: -1 }}, function (err, top5){
                                    if (err)
                                        return res.send(err);
                                    //update cache
                                    client.set('top5', JSON.stringify(top5), 'EX', 600);
                                    //get user rank
                                    client.get(req.body.score, function (err, rank) {
                                        if (rank) {
                                            var data = { rank: rank, success: true, top5: top5 };
                                            console.log(data);
                                            return res.json(data);
                                        } else {
                                            //get user rank
                                            User.find({ points:  {$gt: parseInt(req.body.score)} }, 'points', function (err, users) {
                                                if (err)
                                                    return res.send(err);
                                                //update cache
                                                client.set(req.body.score, users.length + 1, 'EX', 600);
                                                var data = { rank: users.length + 1, success: true, top5: top5 };
                                                console.log(data);
                                                return res.json(data);
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
            } else {
                //user not found
                return res.json({ message: 'User was not found!', success: false });
            }
        });
});

router.route('/top5')
    .get(function(req, res) {
        //returns top5 to user that is not logged in
        User.find({}, 'points name', {limit: 5, sort: { points: -1 }}, function (err, top5){
            if (err)
                return res.send(err);
            var data = { top5: top5, success: true };
            return res.json(data);
        });
});

app.use('/api', router);

app.listen(app.get("port"));
console.log('Magic happens on port ' + app.get("port"));