#!/usr/bin/node

const Influx = require("influx");
const createReaders = require("./readers");
const createActions = require("./actions");
const actionProcessor = require("./actionProcessor");
const createActuator = require("./actuate/relayActuator");
require("./controlPanel");

const influx = new Influx.InfluxDB({
    host: "localhost",
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

const water = createActuator({ influx, sensor: "pump", relay: 6 });
const fan = createActuator({ influx, sensor: "fan", relay: 8 });
const circFan = createActuator({ influx, sensor: "fan:circulation", relay: 5 });
const dripValve = createActuator({ influx, sensor: "valve:drip", relay: 7 });
const readers = createReaders(influx);
const actions = createActions({ water, fan, circFan, dripValve, ...readers });

actionProcessor({ actions });
