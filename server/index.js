// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  router = require('./router'),
  config = require('./config/main'),
  cors = require('cors'),
  models = require("./models"),
  sqlite = require('sqlite3');

// for testing
app.use(cors());

//Sync Database
models.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  server = app.listen(config.port);
  console.log(`Your server is running on port ${config.port}.`);
} else{
  server = app.listen(config.test_port);
}

// Set static file location for production
// app.use(express.static(__dirname + '/public'));

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    var allowedOrigins = ['http://localhost:8080', 'http://localhost:3001', 'http://178.128.73.230:3001', 'http://178.128.73.230:9001', 'http://178.128.73.230:8080'];
    var origin = req.headers.origin;
    console.log("origin: "+origin);
    /*if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Type', 'application/json; charset=utf-8');*/
    next();
});

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;