var express = require('express');
var fixtures = require('./fixtures.js');
var passport = require('./auth.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session  = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config');

var app = express();
var id = 4;

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/api/auth/login', bodyParser.json(), function(req, res, next) {
  var username, password;

  username = req.body.username;
  password = req.body.password;

  console.log('In the post for login');
  console.log('username: ' + username + ', password: ' + password);

  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      console.log('error on login: 500');
      return res.sendStatus(500); 
    }

    if (!user) { 
      console.log('error on login: no such user');
      return res.sendStatus(403);
    }

    req.logIn(user, function(err) {
      if (err) { 
        console.log('error on login: 403 (password did not match?)');
        return res.sendStatus(500);
      }

      console.log('login: successful');
      return res.send({
        user: req.user
      });
    });
  })(req, res, next);
});

app.post('/api/auth/logout', function(req, res) {
  req.logOut();

  return res.sendStatus(200);
});

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

function ensureAuthentication(req, res, next) {
  if (req.isUnauthenticated()) {
    return res.sendStatus(403);
  }

  next();
}

app.post('/api/tweets', ensureAuthentication, bodyParser.json(), function(req, res) {
  console.log('In the post for /api/tweets');

  if (!req.body) {
    return res.sendStatus(400);
  }

  var tweet = req.body.tweet;

  tweet.userId = req.user.id;
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

  req.logIn(user, function(err) {
    if (err) { 
      console.log('error on login: 403 (password did not match?)');
      return res.sendStatus(500);
    }

    console.log('new user created successfully');
  });

  return res.sendStatus(200);
});

app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
  var tweetId = req.params.tweetId;
  var index = -1;
  var user = req.user;

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
    if (user.id !== fixtures.tweets[index].userId) {
      return res.sendStatus(403);
    }

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

var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;
