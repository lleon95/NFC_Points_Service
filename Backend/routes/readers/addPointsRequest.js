/**
 * NFC Points Service
 * Readers - Points Adder Script
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 9th 2018
 * Last Revision: May 9th 2018
 */

module.exports = function(app, models, errors, defs)
{
    app.post('/readers/addPointsRequest', function(req, res)
    {
        // Get data: readerID, cardID, cardToken, readerToken, points
        var dataGot = req.body;
        // Verify reader access - readerID
        //console.log(dataGot);
        var readerQuery = models.readerSch.findOne({"readerID":dataGot.readerID});
        readerQuery.exec(function(err, reader){
            if(err)
            {
                console.log("Readers/Add Error: " + err);
                res.json({error:-1});
            }
            else if(reader == null)
            {
                
                console.log("Readers/Adder Error: Reader not found");
                res.json({cardID: null, error:errors.addPointsRequest.readerNotFound, result:null});
            }
            else
            {
                // Test
                if(reader.readerToken == dataGot.readerToken)
                {
                    // Successfully auth: look for card owner
                    var cardQuery = models.cardSch.findOne({uuid: dataGot.cardID});
                    cardQuery.exec(function(err, card){
                        // Verify if the card is OK
                        if(err)
                        {
                            console.log("Readers/Adder Error: " + err);
                            res.json({error:-1});
                        }
                        else if(card == null)
                        {
                            res.json({cardID: null, error:errors.addPointsRequest.cardNotFound, result:null});
                            console.log("Readers/Adder Error: Card not found");
                        }
                        else
                        {
                            if(card.token == dataGot.cardToken)
                            {
                                // OK: look for the user
                                cardID = models.mongoose.Types.ObjectId(card._id);
                                console.log(cardID);
                                var userQuery = models.userSch.findOne({linkedCard: card._id});
                                userQuery.exec(function(err, user){
                                    if(err)
                                    {
                                        console.log("Readers/Adder Error: " + err);
                                        res.json({error:-1});
                                    }
                                    else if(user == null)
                                    {
                                        res.json({cardID: null, error:errors.addPointsRequest.userNotFound, result:null});
                                        console.log("Readers/Adder Error: User not found");
                                    }  
                                    else
                                    {
                                        // add the points
                                        console.log("Readers/Adder Success: User " + user.username + " has made a payment");
                                        // add
                                        user.balance += Number(dataGot.points);
                                        user.save();
                                        // Register in log
                                        var log = new models.logSch();
                                        log.userID = user._id;
                                        log.concept = "Recharge of " + dataGot.points + " in the reader " + reader.readerID + " for " + user.username +" from " + reader.username;
                                        log.points = dataGot.points;
                                        log.server = reader.userID;
                                        log.save();
                                        // Increase the points
                                        models.userSch.update({"_id":reader.userID}, {$inc:{"balance":-dataGot.points}});
                                        // Return
                                        res.json({cardID: card.uuid, error:0, result:{pointsAmountRemaining: user.balance, pointsAdded:dataGot.points}});
                                    }
                                });
                            }
                            else
                            {
                                // Return
                                res.json({cardID: null, error:errors.addPointsRequest.authCardError, result:null});
                                console.log("Readers/Adder Error: Auth error");
                            }
                                
                        }
                    });
                }
                else
                {
                    res.json({cardID: null, error:errors.addPointsRequest.authReaderError, result:null});
                    console.log("Readers/Adder Error: Reader auth error");
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
        readerID, 
        cardID, 
        cardToken, 
        readerToken, 
        points
 */
