/**
 * NFC Points Service
 * Server Script
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 9th 2018
 * Last Revision: May 9th 2018
*/

module.exports = function(app)
{
    // Send all the debuggers
    app.get('/debuggers/*', function(req,res){
        res.sendFile(__dirname.substring(0,__dirname.indexOf("debuggers")) + req.url);
    });
}