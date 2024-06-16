#!/usr/bin/node

const Influx = require("influx");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

console.log("LEESSS GOOO");
const influx = new Influx.InfluxDB({
    host: '192.168.1.118',
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

const sleep = wait => new Promise(resolve => setTimeout(resolve, wait));

const forever = async (func, wait) => {
    while (true) {
        await func().catch(err => console.error(err));
        await sleep(wait);
    }
}

console.log("alive");

influx.getDatabaseNames()
    .then(names => {
        console.log(names);
        if (!names.includes('sensor_db')) {
                console.log("creating db");
            return influx.createDatabase('sensor_db');
        }
        console.log('db already exists');
    }).then(() => forever(async () => {
        console.log("querying...");
        const r = await influx.query(`
            select MEAN(value) as value, sensor
            from sensors
            where time > now() - 5m
            and sensor 
            group by sensor;
          `, {
             placeholders: {
             }
          });

        console.log(r);
    }, 30000))
