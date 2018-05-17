/**
 * NFC Points Service
 * Readers - Errors Script
 * Developer: Luis Leon Vega
 * This is a code for the Electric Communications Lecture Project
 * Date: May 16th 2018
 * Last Revision: May 16th 2018
 */

module.exports = {
    debugMode: true,
    substractPointsRequest:
    {
        readerNotFound:1,
        cardNotFound:2,
        userNotFound:3,
        creditsNotEnough:4,
        authCardError:5,
        authReaderError:6
    }
};