import binascii
import functools
import requests


# Create bytearray from list of integers.
values = bytearray(b'\x10\x34\xfc\x92\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x00')
str_values = str(values)
#print(int(binascii.hexlify(values), 16))

# Modify elements in the bytearray.
values[1] = 64
##values[4] = b'\x40'
print(values)
print(str_values)
print(values[2])

result = ""

# Display bytes.
for value in range (0,4):
    a = str(hex(values[value]))
    a = a.split("x")[1]
    result += a + " "
result1 = result[0:11]



print (result)
print(result1)
print(len(result))
print(len(result1))
print (values[1])

UUID = str(hex(values[0]))+ " " + str(hex(values[1]))+ " " + str(hex(values[2]))+ " " + str(hex(values[3]))
UUIDs = str(hex(values[0])).split("x")[1]+ " " + str(hex(values[1])).split("x")[1]+ " " + str(hex(values[2])).split("x")[1]+ " " + str(hex(values[3])).split("x")[1]

print(len(UUIDs))


print (UUIDs)
print (UUID)
