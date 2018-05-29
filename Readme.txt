*********************************
    Readme
    Last Updated: May 18th 2018
    Architect: Luis Leon
    Last Updated: May 1st 2018
*********************************

--------------------------
Index:
--------------------------

1. Description
2. Project file tree
    2.1. Branches and rules
    2.2. File tree
3. Card Requirements:
    3.1. Standard Requirements
    3.2. Security Requirements
4. System Requirements for readers
    4.1. Work flow
    4.2. Hardware Requirements
    4.3. Communication Requirements
5. System Requirements for backend
    5.1. Work flow
    5.2. Block diagram and description
    5.3. I/O modules
    5.4. Debuggers
6. System Requirements for website
    6.1. Work flow
    6.2. Pages
    6.3. Communication Requirements



--------------------------
1. Description
--------------------------

In order to keep the order and integrity of the project, we have to follow an understood universal structure. 
For that, there are some protocols and rules we must follow to avoid further problems during development process.

Some of there protocols are:

    - Nomenclature: 
        Variables name must be respected to guarantee a properly coupling between different subsystems.
        For example:
            * readerID: is the reader ID. It will be unique to every readers.
            * cardID: is the cardID. Each card has its own ID and helps to identify a spectific user account.
    - Communication API:
        Backend communication is based in RESTful APIs. That means that all the access will be done through
        HTTP POST and GET request.
        For example:
            * PaymentRequest: this API substract credit from the user's account. 
                URL: /readers/substractPointsRequest
                PARAMS: readerID, cardID, cardToken, readerToken, points
                RETURN: cardID, error, result: {pointsAmountRemaining, pointsSubstracted}
    - Error coding:
        Instead expressing the errors using text, we could coded them in order to compress them and ease their transmition. 
        For example:
            * error[10] = "Some parameters are missing"
    - Definitions:
        One needs to define some constants, such as readerID, points, etc. These constants should be saved in a definitions file
        named "definitions.js" or "definitions.py". It will ease the changes in further implementations.
    - Security Standards:
        MiFare will be used as technology in our NFC cards. This implies assign a cardToken into the memory of each card as basic
        safety directive. 

--------------------------
2. Project File Tree
--------------------------

Undefined file structures lies in mess. It also happens when there are not good practices using Control Version Programs, like Git.
For that, let's define our branches and files tree.

2.1. Branches and rules

---- First rule: DO NOT MERGE AND PUSH TO THE MASTER BRANCH
The master branch must only be manipulated when a part is completely debugged, tested and ready for deployment. Also, there should be
a member in charge of that. Please, seriously, do not touch the master branch until the project is completed.

In order to work on each part individually, the branches shall be divided in:

    - Reader: In charge of Danny and Javier
    - Backend: In charge of Luis
    - Frontend: In charge of Luis

Another thing: do not invade others' branches.

2.2. File tree

For readers:

    - Reader
        - master.py: main script
        - submodules/
            + Put all the required submodules here. For example: nfcComm.py, serverComm.py, stateMachine.py ...
        - configs/
            - definitions.py: all the definitions should be put here. Treat everything as a definitions class.
            - errors.py: error codification should be treated as an errors class. Also they could be a fixed list.
        + Anything else you guys consider important.

For backend:

    - Backend
        - server.js: main script
        - models/
            + Put the MongoDB models here.
        - configs/
            - definitions.js
            - errors.js
        - routes/
            - readers/
                - substractPointsRequest.js
                - addPointsRequest.js
            - frontend/
                + Missing now
            - users/
                + Missing now
            - data/
                + Missing now
            - root/
                + addUser.js
                + editUser.js
                + deleteUser.js

For frontend: to define

--------------------------
3. Card requirements
--------------------------

3.1. Standard Requirements

Due to problems of compatibility and the prestige of MiFare, this tech will be implemented. However, please consider
about another alternatives in order to discuss its reliability.

To write the cards, you can use the NFC example by Adafruit for Arduino.

3.2. Security Requirements

Each card has an UUID (unique code ID) which identifies every card in the world. Likewise, the NFC cards under the standard 
14443 allows to write into the memory of each card. 

To reforce the security, we are going to write a "cardToken". 

In this case, please use:

    - 9 2563 2115 for the card - UUID:
    - 3 5441 6332 for the tag  - UUID:

For both, the password could be:

    - 12345678

Please, paste the UUID of the card and the tag above. 

----------------------------------
4. System Requirements for readers
----------------------------------

4.1. Work flow

A workflow defines the data process of a module or system. In this case, the readers should be able to substract points.
Thus, the workflow is:

    1. PN532 reads the UUID and shows it in console
    2. PN532 reads the memory using the password (12345678) and returns the content in console
    3. The script collects the memory data and creates and object as follows:
        obj = {
            readerID: it's a constant
            cardID: it's the UUID read
            cardToken: it's the memory content deciphered
            readerToken: it's a constant
            points: it's defined by three buttons (1st: 500 points, 2nd: 1000 points, 3rd: 5000 points)
        }
    4. Afterwards, the object should be posted onto the API request:
        API: /readers/substractPointsRequest
    5. Data is returned from (4):
        objReturned: {
            cardID: it's the UUID 
            error: it's a number (0 means no error)
            result: {
                pointsAmountRemaining
                pointsSubstracted
            }
        }
        To collect that object, use "import json". The incoming data from return is a string
    6. Shows in the screen (or console) if the transaction was approved or denied, the pointsRemaining and how many points were substracted
    7. Loop (Go To 1)

4.2. Hardware Requirements

The user should be able to select using one or three buttons between three products whose cost is different (500 points, 1000 points and 5000 points).
This amount will be substracte once the card is put over the reader.

Then, the components are:

    - Raspberry PI as computing unit
    - PN532 as NFC reader
    - 1 or 3 buttons to choose the product
    - 3 LEDs which shows the seleccion.
    - A screen to shows important data

Also, it should be possible to recharge points using another button (recharges are 1000 points each). This is only for debugging

4.3. Communication Requirements

All the APIs return data in JSON format. To integrate that to Python, use json library.

To substract points:

TYPE: HTTP POST
URL: /readers/substractPointsRequest
POST DATA: 
    {
        readerID: it's a constant
        cardID: it's the UUID read
        cardToken: it's the memory content deciphered
        readerToken: it's a constant
        points: it's defined by three buttons (1st: 500 points, 2nd: 1000 points, 3rd: 5000 points)
    }
RETURN:
    {
        cardID: it's UUID
        error: 0 if there is no error
        result: {
            pointsAmountRemaining
            pointsSubstracted
        }
    }

To add points:

TYPE: HTTP POST
URL: /readers/addPointsRequest
POST DATA: 
    {
        readerID: it's a constant
        cardID: it's the UUID read
        cardToken: it's the memory content deciphered
        readerToken: it's a constant
        points: it's fixed to 1000 points
    }
RETURN:
    {
        cardID: it's UUID
        error: 0 if there is no error
        result: {
            pointsAmountRemaining
            pointsAdded
        }
    }

NOTE: both API have already been implemented!


----------------------------------
5. System Requirements for backend
----------------------------------

    5.1. Work flow

    First, the role must be define before going on:

    a) Role = 666:
        It's the root user. It could add, edit and delete users. It does not have credit and those stuff as a normal user.
        It could change the card of a user.
    b) Role = 1:
        It's the seller or merchant. They manage their credit (see), could add and substract points using the API and a "virtual reader".
    c) Role = 0:
        It's a normal user. It only could see their credit.

    Defined those aspects, the workflows are as following:

    a) User management

         -> |Add new user|                             |username, password, email, name, role| (addUser.js)     all are postable scripts
    ROOT -> |Edit user   |   -> Required parameters -> |password, linkedCard, email, balance | (editUser.js)    all are postable scripts
         -> |Remove user |                             |username                             | (deleteUser.js)  all are postable scripts


    USER, SELLER -> |Edit user|  -> Required parameters -> |username, sessionToken, email (editable), name (editable) | (editUser.js)

    b) Reader management

         -> | Add reader    |                           |readerID, username, userID, readerToken  | (addReader.js)      all are postable scripts
    ROOT -> | Edit reader   | -> Required parameters -> |readerID, username, userID, readerToken  | (editReader.js)     all are postable scripts
         -> | Remove reader |                           |readerID                                 | (deleteReader.js)   all are postable scripts

    SELLER -> |See my reader details| -> Required parameters -> |username, sessionToken, readerID| -> Shown values -> |username, readerID|

    c) Card management

    USER -> | See card details | -> Required -> |username, sessionToken| -> Shown values -> |UUID|

         -> | Add card    |                           |uuid, password, token, username  | (addReader.js)      all are postable scripts
    ROOT -> | Edit card   | -> Required parameters -> |uuid, password, token, username  | (editReader.js)     all are postable scripts
         -> | Remove card |                           |uuid                             | (deleteReader.js)   all are postable scripts

    d) General details

    - The user could see their balance, name and transactions (using log)
    
    
    5.2. Block diagram and description
    5.3. I/O modules
    5.4. Debuggers
6. System Requirements for website
    6.1. Work flow
    6.2. Pages
    6.3. Communication Requirements
