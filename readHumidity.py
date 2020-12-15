#!/usr/bin/python3

import Adafruit_DHT

sensor = Adafruit_DHT.DHT22
pin = 24

humidity, _ = Adafruit_DHT.read_retry(sensor, pin)

if humidity is not None:
	print("{0:0.1f}".format(humidity))
