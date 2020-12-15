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
    }).then(async () => {
        const measurements = [];
        for (const { sensor, cmd } of config) {
            const value = parseFloat((await execAsync(cmd)).stdout.toString());
            measurements.push({
                measurement: "sensors",
                fields: { value },
                tags: { sensor }
            });
        }
        return influx.writePoints(measurements);
    })

    .catch(err => console.error(err))
