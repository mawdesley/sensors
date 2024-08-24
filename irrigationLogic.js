#!/usr/bin/node

const Influx = require("influx");
const createReaders = require("./readers");
const createActions = require("./actions");
const actionProcessor = require("./actionProcessor");
const createWater = require("./actuate/water");

const influx = new Influx.InfluxDB({
    host: "192.168.1.118",
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

const water = createWater(influx);
const readers = createReaders(influx);
const actions = createActions({ water, ...readers });

actionProcessor({ actions });
