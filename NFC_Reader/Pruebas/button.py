import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP) #Set pull up resistor
GPIO.setup(24, GPIO.OUT) #LED

try:
    while True:
        button_state = GPIO.input(23)
        if button_state == False:
            GPIO.output(24,True)
            time.sleep(1)
        else:
            GPIO.output(24,False)
except:
    GPIO.cleanup()
