###################################################################
###################################################################
### This module sets the password and CardToken to the tag/card ###
###                                                             ###
###                                                             ###
### Password @ Sector: 0 Block: 1                               ###
### User ID @ Sector: 0 Block: 2                                ###
###################################################################
###################################################################

from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
from py532lib.mifare import *

passw = b'\x44\x61\x6e\x6e\x79\x20\x47\x20\x4d\x65\x6a\x69\x61\x73\x20\x41'
token = b'\x10\x20\x30\x40\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'

tag = Mifare()
tag.SAMconfigure()
tag.set_max_retries(MIFARE_WAIT_FOR_ENTRY)
uid = tag.scan_field()

if uid:
    address = tag.mifare_address(0,2)
    tag.mifare_auth_a(address,MIFARE_FACTORY_KEY)
    tag.mifare_write_standard(address,token)
    data = tag.mifare_read(address)
    print (data)

    address = tag.mifare_address(0,1)
    tag.mifare_write_standard(address,passw)
    data = tag.mifare_read(address)
    print (data)

    tag.in_deselect()