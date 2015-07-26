var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fixtures = require('./fixtures.js');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var user = null;

  for (var i = 0; i < fixtures.users.length; i++ ) {
    if (fixtures.users[i].id === id) {
      user = fixtures.users[i];      
    }
  }

  if (!user) {
    done(null, false);
  } else {
    done(null, user);
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var user = null;

    console.log('authorize user');

    for (var i = 0; i < fixtures.users.length; i++ ) {
      if (fixtures.users[i].id === username) {
        user = fixtures.users[i];      
      }
    }

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    } else {
      // Check password
      if (user.password === password) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    }
  }
));

module.exports = passport;