var nconf = require('nconf');
var path = require('path');
var configPath; // = path.join(__dirname, 'config-prod.json');

// console.log(configPath);
// console.log('NODE_ENV is: ' + process.env.NODE_ENV);

if (process.env.NODE_ENV === 'test') {
  configPath = path.join(__dirname, 'config-test.json');
} else if (process.env.NODE_ENV === 'prod') {
  configPath = path.join(__dirname, 'config-prod.json');
} else {
  configPath = path.join(__dirname, 'config-dev.json');
}

nconf.file(configPath);

// "nconf" is a reference to the nconf object
// that loaded the config file
module.exports = nconf;