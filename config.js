const Joi = require('joi');
const { execAsync } = require("spawn");


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
            cmd: async () => {
            const adc = parseFloat((await execAsync("ioplus 0 adcrd 8")).stdout.toString());
            return (adc / 3.3 * 100)
        },
            validate: validate(Joi.number().min(0).max(100)),
        },
        {
            sensor: "humidity",
            cmd: "./read/humidity.py",
            validate: validate(Joi.number().min(0).max(100)),
        },
        {
            sensor: "soil",
            cmd: async () => {
                const adc = parseFloat((await execAsync("ioplus 0 adcrd 6")).stdout.toString());

                return 100 - (adc / 3.3 * 100)
            },
            validate: validate(Joi.number().min(0).max(100)),
        },
        {
            sensor: "co2",
            cmd: async () => {
                const adc = parseFloat((await execAsync("ioplus 0 adcrd 7")).stdout.toString());
                const minV = 0.4;
                const range = 1.6;
                const maxPPM = 5000;
                const co2 = ((adc - minV) / range) * maxPPM;
                return co2;
            },
            validate: validate(Joi.number().min(0).max(5000)),
        },
        {
            sensor: "temperature",
            cmd: "./read/temperature.py",
            validate: validate(Joi.number().min(-10).max(50)),
        },
        {
            sensor: "leaf-temperature",
            cmd: "./read/ir-object-temperature.py",
            validate: validate(Joi.number().min(-30).max(100)),
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
                const at = findSensorValue(measurements, "temperature");
                const elt = at - 2;
                return svp(elt) - (svp(at) * (rh / 100));
            },
        },
        {
            composite: "lVPD",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature");
                const lt = findSensorValue(measurements, "leaf-temperature");
                return svp(lt) - (svp(at) * (rh / 100));
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
