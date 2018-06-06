/**
 * NFC Points Service
 * Users - Get user details: name, balance, card linked and logs
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 28th 2018
 * Last Revision: May 28th 2018 (Some security directives are missing)
 */

module.exports = function(app, models, errors, defs, cookie)
{

    app.get('/users/getUserDetails', function(req,res)
    {
        // Get data: userID, token
        var dataGot = cookie.parse(req.headers.cookie || '');
        // Get user
        var userID = models.mongoose.Types.ObjectId(dataGot.userID);
        var userQuery = models.userSch.findOne({"_id":userID});
        userQuery.select("username name balance linkedCard token");
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
                if(dataGot.token == user.token)
                {
                    // Results buffer
                    var results = {};
                    // Some results loadable by user sch
                    results["username"] = user.username;
                    results["name"] = user.name;
                    results["balance"] = user.balance;
                    //console.log(user.linkedCard);
                    var cardQuery = models.cardSch.findById(user.linkedCard);
                    cardQuery.exec(function(err, card)
                    {
                        if(err || card == null)
                        {
                            results["linkedCard"] = "Unknown";
                        }
                        else
                        {
                            //console.log(card);
                            results["linkedCard"] = card.uuid;
                            
                        }
                        // Load last 10 transactions
                        var logQuery = models.logSch.find({$or:[{"userID":userID},{"server":userID}]}).sort({"_id":-1}).limit(9);
                        logQuery.select("concept points created_at");
                        logQuery.exec(function(err, logs){
                            results["logs"] = logs;
                            // Return
                            res.json({result: results, error:0});
                        });
                        
                    });
                    
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
        userID
        token
 */
