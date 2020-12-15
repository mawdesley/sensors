#!/usr/bin/node

const Influx = require("influx");
const commandLineArgs = require('command-line-args');
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const options = commandLineArgs([
    { name: "command", type: String },
    { name: "sensor", type: String }
]);

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
    })
    .then(() => execAsync(options.command))
    .then(output => parseFloat(output.stdout))
    .then(data => influx.writePoints([{
        measurement: "sensors",
        fields: {
            value: data
        },
        tags: {
            sensor: options.sensor
        }
    }]))
    .catch(err => console.error(err))
