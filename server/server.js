var express    = require('express');
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var User = require('./models/user');