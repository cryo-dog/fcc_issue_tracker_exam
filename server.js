'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js'); // TR: Added to be able to use routes instead of modules... both is fine
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

// TR: Added DB connection
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB database connection established successfully in server.js');
});


// TR: End of DB connection

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

// Middleware function for logging requests
const requestLogger = (req, res, next) => {
  console.log("---------------------------------------");
  console.log(`Incoming ${req.method} request for ${req.originalUrl}`);
  console.log("Body: ");
  console.log(req.body);
  console.log(req.query);
  console.log("---------------------------------------");
  next();
};

// TR: Create a model everytime a request is made
const IssuesSchema = require("./controllers/user_schema");
const issueModel = function (project) {
  //
  const model = mongoose.model(project, IssuesSchema);
  return model;
};

app.use("/api/issues/:project", (req, res, next) => {
  const project = req.params.project;
  const model = issueModel(project);
  req.issueModel = model;
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Use the middleware function
app.use(requestLogger);


//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
// apiRoutes(app);   //FCC version
// TR my version with routes
app.use("/api", apiRoutes);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
