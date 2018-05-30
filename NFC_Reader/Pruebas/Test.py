from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
from py532lib.mifare import *


#pn532 = Pn532_i2c()
#pn532.SAMconfigure()

#card_data = pn532.read_mifare().get_data()

#print (card_data)

card = Mifare()
card.SAMconfigure()
card.set_max_retries(MIFARE_WAIT_FOR_ENTRY)
uid = card.scan_field()
dataw = b'\x33\x30\x33\x33\x33\x30\x33\x33\x33'
if uid:
    print ('UIS ' + str(uid))
    address = card.mifare_address(0,2)
    card.mifare_auth_a(address,MIFARE_FACTORY_KEY)
    data = card.mifare_read(address)
    print (data)
    card.mifare_write_standard(address,dataw)
    data = card.mifare_read(address)
    print (data)
    card.in_deselect()

##card = Mifare()
##card.SAMconfigure()
##card.set_max_retries(MIFARE_WAIT_FOR_ENTRY)
##uid = card.scan_field()
###dataw = b'\x44\x61\x6e\x6e\x79\x20\x47\x20\x4d\x65\x6a\x69\x61\x73\x20\xff'
##if uid:
##    print (uid)
##    address = card.mifare_address(1,3)
##    #card.mif  are_auth_a(address,MIFARE_FACTORY_KEY)
##    data = card.mifare_write_access(address,False,False,True,MIFARE_FACTORY_KEY,MIFARE_FACTORY_KEY)
##    print (data)
##    #card.mifare_write_standard(address,dataw)
##    #data = card.mifare_read(address)
##    #print (data)
##    card.in_deselect()

