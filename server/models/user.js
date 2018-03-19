var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    points: Number,
    lastModified: { 
        type: Date, 
        default: Date.now,
        expires: 24*60*60*7
    }
});

module.exports = mongoose.model('User', UserSchema);