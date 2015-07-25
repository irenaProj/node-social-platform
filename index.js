var express = require('express');
var fixtures = require('./fixtures.js');
var app = express();
var bodyParser = require('body-parser');
var id = 4;

app.get('/api/tweets/:tweetId', function(req, res) {
  var tweetId = req.params.tweetId;
  var tweet = null;

  for (var i = 0; i < fixtures.tweets.length; i++ ) {
    if (fixtures.tweets[i].id === tweetId) {
      tweet = fixtures.tweets[i];
    }
  }

  if (!tweet) {
    return res.sendStatus(404);
  } else {
    return res.send({
      tweet: tweet
    });
  }
});

app.post('/api/tweets', bodyParser.json(), function(req, res) {
  console.log('In the post for /api/tweets');

  if (!req.body) {
    return res.sendStatus(400);
  }

  var tweet = req.body.tweet;

  tweet.id = id;
  id++;
  tweet.created = Math.floor(Date.now() / 1000);

  fixtures.tweets.push(tweet);

  return res.status(200).send({
      tweet: tweet
    });
});


app.post('/api/users', bodyParser.json(), function(req, res) {
  console.log('In the post for /api/users');

  if (!req.body) {
    return res.sendStatus(400);
  }

  var user = req.body.user;
  user.followingIds = [];

  console.log(user);

  // Check user does not exist
  for (var i = 0; i < fixtures.users.length; i++ ) {
    if (fixtures.users[i].id === user.id) {
      return res.sendStatus(409);
    }
  }

  fixtures.users.push(user);

  return res.sendStatus(200);
});

app.delete('/api/tweets/:tweetId', function(req, res) {
  var tweetId = req.params.tweetId;
  var index = -1;

  for (var i = 0; i < fixtures.tweets.length; i++ ) {
    if (fixtures.tweets[i].id === tweetId) {
      index = i;
      console.log(fixtures.tweets[i]);

      break;
    }
  }

  if (index === -1) {
    return res.sendStatus(404);
  } else {
    fixtures.tweets.splice(index, 1);
    console.log(fixtures.tweets);

    return res.sendStatus(200);
  }
});


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
