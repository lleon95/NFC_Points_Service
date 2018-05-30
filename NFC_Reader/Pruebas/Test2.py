#################################################################
#################################################################
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
##                                                             ##
## Password @ Sector: 0 Block: 1                               ##
## User ID @ Sector: 0 Block: 2                                ##
##                                                             ##
##                                                             ##
##                                                             ##
#################################################################
#################################################################

from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
from py532lib.mifare import *
#imptag RPi.GPIO as GPIO
import time
import requests
import json

#GPIO.setmode(GPItagCM)

#GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP) #Set pull up resistor
#GPIO.setup(24, GPIO.OUT) #tag


 
class Transaccion:
    def __init__(self):
        self.readerID = 'reader1'
        self.cardID = '00 00 00 00'
        self.cardToken = 'token' #User ID
        self.readerToken = 'reader1'
        self.points = '1000'
        self.password = '12345678'

#URL='http://92.222.73.56:1337/debuggers/substractPointsRequest'
URL='http://92.222.73.56:1337/readers/addPointsRequest'

tag = Transaccion()

payload={
    'readerID': tag.readerID,
    'cardID': tag.cardID,
    'cardToken': tag.cardToken,
    'readerToken': tag.readerToken,
    'points': tag.points
}
r = requests.post(URL, data=payload)
print(r.json())


