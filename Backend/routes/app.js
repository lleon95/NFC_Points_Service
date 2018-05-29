/**
 * NFC Points Service
 * Users - Frontend loader
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 28th 2018
 * Last Revision: May 28th 2018 (Some security directives are missing)
 */

module.exports = function(app)
{

    app.get('/app/*', function(req,res)
    {
        res.sendFile(__dirname.substring(0,__dirname.indexOf("Backend"))+"Frontend"+req.url);
    }
    );

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
