#!/usr/bin/node

const Influx = require("influx");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const config = require("./config");


const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'sensor_db',
    schema: [
        {
            measurement: "sensors",
            fields: {
                value: Influx.FieldType.FLOAT
            },
            tags: [
                "sensor"
            ]
        }
    ]
});

influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('sensor_db')) {
            return influx.createDatabase('sensor_db');
        }
    }).then(() => setInterval(async () => {
        const measurements = [];
        for (const { sensor, cmd } of config.sensors) {
            const value = parseFloat((await execAsync(cmd)).stdout.toString());
            measurements.push({
                measurement: "sensors",
                fields: { value },
                tags: { sensor }
            });
        }

        for (const { composite, cmd } of config.composites) {
            const value = cmd(measurements);
            measurements.push({
                measurement: "sensors",
                fields: { value },
                tags: { sensor: composite }
            });
        }
        return influx.writePoints(measurements);
    }, 60000))
    .catch(err => console.error(err))
