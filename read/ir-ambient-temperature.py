#!/usr/bin/env python3

import board
import busio as io
import adafruit_mlx90614

i2c = io.I2C(board.SCL, board.SDA, frequency=100000)
temperature = adafruit_mlx90614.MLX90614(i2c).ambient_temperature
print("{0:0.2f}".format(temperature))