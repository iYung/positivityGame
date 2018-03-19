var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    id: String,
    points: Number,
    lastModified: { 
        type: Date, 
        default: Date.now,
        expires: 24*60*60
    }
});

module.exports = mongoose.model('User', UserSchema);