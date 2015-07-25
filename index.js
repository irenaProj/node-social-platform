var express = require('express');
var fixtures = require('./fixtures.js');

var app = express();

app.get('/api/users/:userId', function(req, res) {
  var userId = req.params.userId;
  var user = null;

  for (var i = 0; i < fixtures.users.length; i++ ) {
    if (fixtures.users[i].id === userId) {
      user = fixtures.users[i];
    }
  }

  if (!user) {
    return res.sendStatus(404);
  } else {
    return res.send({
      user: user
    });
  }
});

app.get('/api/tweets', function(req, res) {
  //console.log('In the GET');

  var userId = req.query.userId;

  if (!userId) {
    return res.sendStatus(400);
  }

  var tweets = [];

  for (var i = 0; i < fixtures.tweets.length; i++) {
    if (fixtures.tweets[i].userId === userId) {
      tweets.push(fixtures.tweets[i]);
    }
  }

  var sortedTweets = tweets.sort(function(t1,t2) {
    if (t1.created > t2.ctreated) {
      return -1;
    } else if (t1.created === t2.ctreated) {
      return 0;
    } else {
      return 1;
    }
  });

  return res.send({
    tweets: sortedTweets
  });
});

var server = app.listen(3000, '127.0.0.1');

module.exports = server;
