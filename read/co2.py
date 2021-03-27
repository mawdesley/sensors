#!/usr/bin/env python3
import time
import ioexpander as io

ioe = io.IOE(i2c_addr=0x18)

ioe.set_adc_vref(3.3)
pin = 9
ioe.set_mode(pin, io.ADC)

adc = ioe.input(pin)
minV = 0.4
range = 1.6
maxPPM = 5000
co2 = ((adc - minV) / range) * maxPPM
co2 = round(co2, 2)

print("{:.2f}".format(co2))