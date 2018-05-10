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
        var readerQuery = models.readerSch.findOne({readerID:dataGot.readerID});
        readerQuery.exec(function(err, reader){
            if(err)
                console.log("Readers/Substractor Error: " + err);
            else if(reader == null)
                console.log("Readers/Substractor Error: Reader not found");
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
                            console.log("Readers/Substractor Error: " + err);
                        else if(card == null)
                            console.log("Readers/Substractor Error: Card not found");
                        else
                        {
                            if(card.token == dataGot.cardToken)
                            {
                                // OK: look for the user
                                var userQuery = models.userSch.findOne({linkedCard: dataGot.cardID});
                                userQuery.exec(function(err, user){
                                    // Substract the points
                                    if(user.balance < dataGot.points)
                                    {
                                        console.log("Readers/Substractor Error: User " + user.username + " does not have enough credit");
                                        res.json({cardID: card.uuid, error:"Fondos no suficientes", result:{pointsAmountRemaining: user.balance, pointsSubstracted:dataGot.points}});
                                    }
                                    else
                                    {
                                        console.log("Readers/Substractor Success: User " + user.username + " has made a payment");
                                        // Substract
                                        user.balance -= dataGot.points;
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
                                });
                            }
                            else
                                console.log("Readers/Substractor Error: Auth error");
                        }
                    });
                }
                else
                    console.log("Readers/Substractor Error: Reader auth error");
            }
        });
    });
}
