var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    points: Number
});

module.exports = mongoose.model('User', UserSchema);