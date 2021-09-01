const Joi = require('joi');

const findSensorValue = (measurements, sensor) =>
    measurements.find(m => m.tags.sensor === sensor).fields.value;

const svp = (t) => 0.61078 * Math.exp(((17.27 * t) / (t + 237.3)));

const validate = schema => result => {
    const { error } = schema.validate(result)

    if (error) {
        throw error;
    }
}

module.exports = {
    sensors: [
        {
            sensor: "light",
            cmd: "./read/adc.py 8",
            validate: validate(Joi.number().min(0).max(100)),
        },
        {
            sensor: "humidity",
            cmd: "./read/humidity.py",
            validate: validate(Joi.number().min(0).max(100)),
        },
        {
            sensor: "soil",
            cmd: "./read/adc.py 14",
            validate: validate(Joi.number().min(0).max(100)),
        },
        {
            sensor: "co2",
            cmd: "./read/co2.py",
            validate: validate(Joi.number().min(0).max(5000)),
        },
        {
            sensor: "temperature",
            cmd: "./read/temperature.py",
            validate: validate(Joi.number().min(-10).max(50)),
        }
    ],
    composites: [
        {
            composite: "aVPD",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature");
                return svp(at) * ((1 - rh) / 100);
            }
        },
        {
            composite: "elVPD",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature")
                const elt = at - 2;
                return svp(elt) - (svp(at) * (rh / 100));
            },
        },
        {
            composite: "dew",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature")

                return 243.5 * (Math.log(rh / 100) + ((17.67 * at) / (243.5 + at))) / (17.67 - Math.log(rh / 100) - ((17.67 * at) / (243.5 + at)));
            }
        },
        {
            composite: "abs-humidity",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature")

                return (6.112 * Math.pow(Math.E, (17.67 * at) / (at + 243.5)) * rh * 2.1674) / (273.15 + at)
            }
        },
        {
            composite: "humidity-at-target",
            cmd: measurements => {
                const targetTemp = 25;
                const absHum = findSensorValue(measurements, "abs-humidity");

                return (absHum * (273.15 + targetTemp)) / (6.112 * Math.pow(Math.E, (17.67 * targetTemp) / (targetTemp + 243.5)) * 2.1674)
            }
        }
    ]
}
