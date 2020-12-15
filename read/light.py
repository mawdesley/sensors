#!/usr/bin/env python3
import time
import ioexpander as io

ioe = io.IOE(i2c_addr=0x18)

ioe.set_adc_vref(100) 
pin = 8
ioe.set_mode(pin, io.ADC)


adc = ioe.input(pin)
adc = round(adc, 2)

print("{:.2f}".format(adc))
