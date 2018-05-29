/**
 * NFC Points Service
 * Readers - Points Substractor Script
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 9th 2018
 * Last Revision: May 9th 2018
 */

module.exports = function(app, models, errors, defs)
{
    app.post('/readers/substractPointsRequest', function(req, res)
    {
        // Get data: readerID, cardID, cardToken, readerToken, points
        var dataGot = req.body;
        // Verify reader access - readerID
        //console.log(dataGot);
        var readerQuery = models.readerSch.findOne({"readerID":dataGot.readerID});
        readerQuery.exec(function(err, reader){
            if(err)
            {
                console.log("Readers/Substractor Error: " + err);
                res.json({error:-1});
            }
            else if(reader == null)
            {
                
                console.log("Readers/Substractor Error: Reader not found");
                res.json({cardID: null, error:errors.substractPointsRequest.readerNotFound, result:null});
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
                            console.log("Readers/Substractor Error: " + err);
                            res.json({error:-1});
                        }
                        else if(card == null)
                        {
                            res.json({cardID: null, error:errors.substractPointsRequest.cardNotFound, result:null});
                            console.log("Readers/Substractor Error: Card not found");
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
                                        console.log("Readers/Substractor Error: " + err);
                                        res.json({error:-1});
                                    }
                                    else if(user == null)
                                    {
                                        res.json({cardID: null, error:errors.substractPointsRequest.userNotFound, result:null});
                                        console.log("Readers/Substractor Error: User not found");
                                    }  
                                    else
                                    {
                                        // Substract the points
                                        if(user.balance < dataGot.points)
                                        {
                                            console.log("Readers/Substractor Error: User " + user.username + " does not have enough credit");
                                            res.json({cardID: null, error:errors.substractPointsRequest.creditsNotEnough, result:{pointsAmountRemaining: user.balance, pointsSubstracted:dataGot.points}});
                                        }
                                        else
                                        {
                                            console.log("Readers/Substractor Success: User " + user.username + " has made a payment");
                                            // Substract
                                            user.balance -= Number(dataGot.points);
                                            user.save();
                                            // Register in log
                                            var log = new models.logSch();
                                            log.userID = user._id;
                                            log.concept = "Payment of " + dataGot.points + " in the reader " + reader.readerID + " for " + reader.username;
                                            log.points = dataGot.points;
                                            log.server = reader.userID;
                                            log.save();
                                            // Return
                                            res.json({cardID: card.uuid, error:0, result:{pointsAmountRemaining: user.balance, pointsSubstracted:dataGot.points}});
                                        }
                                    }
                                });
                            }
                            else
                            {
                                // Return
                                res.json({cardID: null, error:errors.substractPointsRequest.authCardError, result:null});
                                console.log("Readers/Substractor Error: Auth error");
                            }
                                
                        }
                    });
                }
                else
                {
                    res.json({cardID: null, error:errors.substractPointsRequest.authReaderError, result:null});
                    console.log("Readers/Substractor Error: Reader auth error");
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
