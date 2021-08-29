const findSensorValue = (measurements, sensor) =>
    measurements.find(m => m.tags.sensor === sensor).fields.value;



module.exports = {
    sensors: [
        {
            sensor: "light",
            cmd: "./read/adc.py 7"
        },
        {
            sensor: "humidity",
            cmd: "./read/humidity.py"
        },
        {
            sensor: "soil 1",
            cmd: "./read/adc.py 8"
        },
        {
            sensor: "soil 2",
            cmd: "./read/adc.py 10"
        },
        {
            sensor: "soil 3",
            cmd: "./read/adc.py 12"
        },
        {
            sensor: "soil 4",
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
                const svp = 610.78 * 2.71828 ^ (at / (at + 238.3) * 17.2694);
                const aVPD = svp * (1 - rh / 100);
                return aVPD;
            }
        },
        {
            composite: "elVPD",
            cmd: measurements => {
                const rh = findSensorValue(measurements, "humidity");
                const at = findSensorValue(measurements, "temperature");
                const elt = at - 2;
                const asvp = 610.78 * 2.71828 ^ (at / (at + 238.3) * 17.2694);
                const elsvp = 610.78 * 2.71828 ^ (elt / (elt + 238.3) * 17.2694);

                const elVPD = elsvp - (asvp * rh / 100);
                return elVPD;
            }
        }
    ]
}