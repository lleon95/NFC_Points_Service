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
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP) #Set pull up resistor
GPIO.setup(24, GPIO.OUT) #LED


 
class Transaccion:
    pass
    def __init__(self):
        self.lectorID = ''
        self.cardID = '' #UID
        self.cardToken = '' #User ID
        self.lectorToken = ''
        self.points = ''

password = b'\x44\x61\x6e\x6e\x79\x20\x47\x20\x4d\x65\x6a\x69\x61\x73\x20\x41'


req = Transaccion()
card = Mifare()

req.lectorID = '13 24 35 46'
req.lectorToken = 'Store 1'

card.SAMconfigure()
card.set_max_retries(MIFARE_WAIT_FOR_ENTRY) # Waits until entry
uid = card.scan_field() # Capture Device's ID
req.cardID = uid
print ('UID: ' + str(uid)) # Print ID NOTA: Revisar conversion de bytearray

if uid:
    
    address = card.mifare_address(0,1) # Sets Password address
    card.mifare_auth_a(address,MIFARE_FACTORY_KEY)
    dev_pw = card.mifare_read(address)
    
    
    if password == dev_pw: # CONVERSION FROM BYTEARRAY

        address = card.mifare_address(0,2)
        req.cardToken = card.mifare_read(address)
        card.in_deselect()

        while True:
            
            a = GPIO.input(23)
            if a == False:
                req.points = 500
                GPIO.output(24,True)
                time.sleep (0.5)
                GPIO.output(24,False)
                break
            #elif

        print(req.cardToken)
        print(req.points)
    
    else:
        print("Password Fatal Error")

else:
    GPIO.cleanup()


