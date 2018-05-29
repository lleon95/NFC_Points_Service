/**
 * NFC Points Service
 * Users - Login
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 28th 2018
 * Last Revision: May 28th 2018 (Some security directives are missing)
 */

module.exports = function(app, models, errors, defs, cookie)
{

    app.post('/login', function(req,res)
    {
        // Get data: userID, token
        var dataGot = req.body;
        // Get user
        var username = req.body.username;
        var userQuery = models.userSch.findOne({"username":username});
        userQuery.select("username _id token password");
        userQuery.exec(function(err,user){
            if(err)
            {
                console.log("User Details Error: " + err);
                res.json({error:-1});
            }
            else if(user == null)
            {   
                console.log("User Details Error: User not found");
                res.json({result: null, error:errors.generalPurpose.userNotFound});
            }
            else
            {
                if(dataGot.password == user.password)
                {
                    var d = new Date();
                    user.token = d.getTime();
                    user.save();
                    // Save cookies
                    var sessionCookies = [];
                    sessionCookies.push('token='+String(d.getTime())+"; path=/");
                    sessionCookies.push('userID='+String(user._id)+"; path=/");
                    res.setHeader('Set-Cookie',sessionCookies);
                    // Return
                    res.json({result: 0, error:0});
                }
                else
                {
                    console.log("User Details Error: Auth Error");
                    res.json({result: null, error:errors.generalPurpose.authError});
                }
            }
        });
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
