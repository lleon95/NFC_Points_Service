/**
 * NFC Points Service
 * Server Script
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 9th 2018
 * Last Revision: May 9th 2018
 */

/*
    Mongoose and Mongo Schemas
*/
// Load modules
const models = require('./models/mongoModels.js');
// There are three: userSch, cardSch, logSch



/*
    Configs
*/
var defs = require('./configs/definitions.js');
var errors = require('./configs/errors.js');

/*
    Express and app management
*/
var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(1337);
var bodyParser = require('body-parser');
app.use(bodyParser.json());                         // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var cookie = require('cookie');                     // Support for cookies
//var bcrypt = require('bcrypt');                     // Hashing

/*
    Communication between reader and Backend
*/
require('./routes/readers/substractPointsRequest.js')(app, models, errors, defs);
require('./routes/readers/addPointsRequest.js')(app, models, errors, defs);

/*
    User app
*/
require('./routes/users/getUserDetails.js')(app, models, errors, defs, cookie);
require('./routes/users/login.js')(app, models, errors, defs, cookie);
require('./routes/users/logout.js')(app, models, errors, defs, cookie);

/*
    Frontend
*/
require('./routes/app.js')(app);

/*
    Debuggers
*/
if(defs.debugMode)
    require('./debuggers/debuggers.js')(app);


//    Debugging details

/* var reader = new models.readerSch();
reader.readerID = "reader1";
reader.username = "master";
reader.readerToken = "reader1";
reader.userID = models.mongoose.Types.ObjectId("5afce01887713d00335fc3ef");
reader.save();

var card = new models.cardSch();
card.uuid = "00 00 00 00";
card.password = "null";
card.token = "token";
card.save();

var userMaster = new models.userSch();
userMaster.username = "master";
userMaster.password = "master";
userMaster.role = 1;
userMaster.save();

var userTest = new models.userSch();
userTest.username = "test";
userTest.password = "test";
userTest.role = 0;
userTest.linkedCard = card._id;
userTest.save(); */

