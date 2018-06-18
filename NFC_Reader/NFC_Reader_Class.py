#################################################################
#################################################################
###  Tecnológico de Costa Rica - Escuela de Ing. Electrónica  ###
###  Laboratorio de Comunicaciones Eléctricas - EL5512        ###
###                                                           ###
###  Profesor: Luis Paulino Méndez                            ###
###                                                           ###
###  Proyecto: NFC Points Service                             ###
###                                                           ###
###  Estudiantes:                                             ###
###  Cordero, Javier. León, Luis. Mejías, Danny.              ###
###                                                           ###
###  Password @ Sector: 0 Block: 1                            ###
###  cardToken (User ID) @ Sector: 0 Block: 2                 ###
#################################################################
#################################################################

from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
from py532lib.mifare import *
import RPi.GPIO as GPIO
import time
import requests
import json

GPIO.setmode(GPIO.BCM)

GPIO.setup(23, GPIO.IN, pull_up_down = GPIO.PUD_UP) #Set pull up resistor
GPIO.setup(24, GPIO.IN, pull_up_down = GPIO.PUD_UP) #Set pull up resistor
GPIO.setup(25, GPIO.IN, pull_up_down = GPIO.PUD_UP) #Set pull up resistor

GPIO.setup(12, GPIO.IN, pull_up_down = GPIO.PUD_UP) #Add or Substract points 


 
class Transaccion (Mifare):
    def __init__(self):
        Mifare.__init__(self)
        self.readerID = 'reader1'
        self.cardID = '' #UID
        self.cardToken = '' #User ID -> Cédula
        self.readerToken = 'reader1'
        self.points = ''
        self.password = b'\x44\x61\x6e\x6e\x79\x20\x47\x20\x4d\x65\x6a\x69\x61\x73\x20\x41'
        self.sector = 0

    def Dev_Config(self):
        self.SAMconfigure()
        self.set_max_retries(MIFARE_WAIT_FOR_ENTRY) #Waits until entry

    def Dev_get_UUID(self):
        UUID = self.scan_field() # Capture Device's ID
        self.cardID = self.bytearray_to_str(UUID)
        return UUID

    def Dev_Auth(self,sector):
        self.sector = sector
        address = self.mifare_address(sector,1) # Sets address
        self.mifare_auth_a(address,MIFARE_FACTORY_KEY)
        #self.in_deselect()

    def Dev_get_cardToken(self):
        address = self.mifare_address(self.sector,1) # Sets Password address
        dev_pw = self.mifare_read(address)
        if self.password == dev_pw: # CONVERSION FROM BYTEARRAY
            address = self.mifare_address(self.sector,2)
            CT = self.mifare_read(address)
            self.cardToken = self.bytearray_to_str(CT)
            return False
        else:
            print ("Invalid credentials")
            return True

    def transfer_points(self):
        return {
            'readerID': self.readerID,
            'cardID': self.cardID,
            'cardToken': self.cardToken,
            'readerToken': self.readerToken,
            'points': self.points
        }

    def bytearray_to_str(self,value):
        #for value in range (0,byte):
    		#hex_value = str(hex(values[value]))
		    #hex_value = hex_value.split("x")[1]
		    #result += hex_value + " "
		#return result[0:11]
        return str(hex(value[0])).split("x")[1]+" "+str(hex(value[1])).split("x")[1]+" "+str(hex(value[2])).split("x")[1]+" "+str(hex(value[3])).split("x")[1]


URL_add='http://92.222.73.56:1337/readers/addPointsRequest'
URL_sub='http://92.222.73.56:1337/readers/substractPointsRequest'

tag = Transaccion()

tag.Dev_Config()
#tag.Dev_Auth(0)
uid = tag.Dev_get_UUID()

if uid:
    try:
        Wrong_Auth = tag.Dev_Auth(0)
        Wrong_Passw = tag.Dev_get_cardToken()
        if not Wrong_Passw:
            tag.in_deselect()
            print('The tag has been correctly recognized')

            while True:
                fivehun = GPIO.input(23)
                onethou = GPIO.input(24)
                fivthou = GPIO.input(25)
                if fivehun == False:
                    tag.points = '500'
                    break
                if onethou == False:
                    tag.points = '1000'
                    break
                if fivthou == False:
                    tag.points = '5000'
                    break

            add_or_sub = GPIO.input(12)
            if add_or_sub:
            	payload = tag.transfer_points()
            	r = requests.post(URL_add, data=payload)
            	print(r.json())
            else:
                payload = tag.transfer_points()
                r = requests.post(URL_sub, data=payload)
                print(r.json())

        else:
            tag.in_deselect
    except:
        print('Authentication Error')
else:
    print ('Recognition Error')

GPIO.cleanup()

#END OF PROGRAM


