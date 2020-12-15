#!/bin/bash

node recordSensor.js --command ./readHumidity.py --sensor humidity
node recordSensor.js --command ./readTemperature.py --sensor temperature
node recordSensor.js --command ./readLight.py --sensor light
node recordSensor.js --command ./readSoil.py --sensor soil

