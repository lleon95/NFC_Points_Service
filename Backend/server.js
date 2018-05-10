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
var bcrypt = require('bcrypt');                     // Hashing

/*
    Communication between reader and Backend
*/


