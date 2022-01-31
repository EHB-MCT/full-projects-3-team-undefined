import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
PIR_PIN = 4
GPIO.setup(PIR_PIN, GPIO.IN)

print("starting")
time.sleep(1)
print("ready")

while True:
	if GPIO.input(PIR_PIN):
		print(time.strftime("%M:%S", time.localtime()) , "motion detected")
	time.sleep(1)
