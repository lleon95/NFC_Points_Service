/**
 * NFC Points Service
 * Mongo Schemas Script
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 9th 2018
 * Last Revision: May 9th 2018
 */

// Global vars
const mongoose = require('mongoose');

// Connection to Mongo
mongoose.connect('mongodb://localhost/NFC_Points_Service');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// Users schema
var user = new mongoose.Schema({
    // User data
    username:           {type: "string", unique: true},
    password:           {type: "string", default: "1234"},
    email:              {type: "string", default: ""},
    name:              {type: "string", default: ""},
    // Points data
    balance:            {type: "Number", default: 0},         // Start with 0 points
    // Card data
    linkedCard:         {type: "string", default: ""},
    // Role
    role:            {type: "Number", default: 0},            // 0 for user, 1 for server and 666 for root
}, { usePushEach: true, timestamps: { createdAt: 'created_at' }  });

// Cards schema
var card = new mongoose.Schema({
    // Card UUID
    uuid:               {type: "string", unique: true},
    password:           {type: "string", default: ""},
    // Card token
    token:              {type: "string", default: ""}         // This content must be equal to the card content
}, { usePushEach: true });

// Transactions
var log = new mongoose.Schema({
    // User details
    userID:              {type: "objectId"},
    // Description
    concept:             {type: "string", default: ""},         // This will load a message legible to user about their transaction
    points:              {type: "Number", default : 0},            // The points involved in the transaction
    server:              {type: "objectId"},                    // The server pointed in the transaction
}, { usePushEach: true, timestamps: { createdAt: 'created_at' }  });

// Module Exporting
module.exports = {
    mongoose    : mongoose,
    userSch     : mongoose.model('users', user),
    cardSch     : mongoose.model('cards', card),
    logSch      : mongoose.model('logs', log)
};