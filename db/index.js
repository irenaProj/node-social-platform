var mongoose = require('mongoose');
var config = require('./../config');
var userSchema = require('./schemas/user');
var tweetSchema = require('./schemas/tweet');

var connection = mongoose.createConnection(config.get('database:host'), config.get('database:name'), config.get('database:port'));
var User = connection.model('User', userSchema);
var Tweet = connection.model('Tweet', tweetSchema);

module.exports = connection;