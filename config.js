const findSensorValue = (measurements, sensor) =>
    measurements.find(m => m.tags.sensor === sensor).fields.value;

const svp = (t) => 0.61078 * Math.exp(((17.27 * t) / (t + 237.3)));

module.exports = {
    sensors: [
        {
            sensor: "light",
            cmd: "./read/adc.py 8"
        },
        {
            sensor: "humidity",
            cmd: "./read/humidity.py"
        },
        {
            sensor: "soil",
            cmd: "./read/adc.py 14"
        },
        {
            sensor: "co2",
            cmd: "./read/co2.py"
        },
        {
            sensor: "temperature",
            cmd: "./read/temperature.py"
        }
    ],
    composites: [
        {
            composite: "aVPD",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature");
                const aVPD = svp(at) * ((1 - rh) / 100);
                return aVPD;
            }
        },
        {
            composite: "elVPD",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature")
                const elt = at - 2;
                const elVPD = svp(elt) - (svp(at) * (rh / 100));
                return elVPD;
            },
        },
        {
            composite: "dew",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature")

                td = 243.5 * (Math.log(rh / 100) + ((17.67 * at) / (243.5 + at))) / (17.67 - Math.log(rh / 100) - ((17.67 * at) / (243.5 + at)));
                return td;
            }
        }
    ]
}
