/**
 * NFC Points Service
 * Users - Logout
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 28th 2018
 * Last Revision: May 28th 2018 (Some security directives are missing)
 */

module.exports = function(app, models, errors, defs, cookie)
{

    app.get('/logout', function(req,res){
        // Input parameters
        var cookies = cookie.parse(req.headers.cookie || '');
        // Delete cookies
        Object.keys(cookies).forEach(function(element) {
            res.clearCookie(element);
        }, this);
        // Return to status
        res.json({result:0}); 
    });


}

/**
 * Error coding:
        readerNotFound:1,
        cardNotFound:2,
        userNotFound:3,
        creditsNotEnough:4,
        authCardError:5,
        authReaderError:6
   Parameters:
        username
        password
 */
