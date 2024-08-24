const Influx = require("influx");
const createReaders = require("./readers");

const HOUR = 3600000;

describe("readers", () => {
    let influx;
    let readers;

    beforeAll(async () => {
        influx = new Influx.InfluxDB({
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

        readers = createReaders(influx);
    });

    it("timeSinceLastWatering", async () => {
        console.log((await readers.timeSinceLastWatering()) / HOUR);
    }, 20000);

    it("timeSinceSunrise", async () => {
        console.log((await readers.timeSinceSunrise()) / HOUR);
    }, 20000);

    it("batteryVoltage", async () => {
        console.log(await readers.batteryVoltage());
    }, 20000);

    it("soilMoisture", async () => {
        console.log(await readers.soilMoisture());
    }, 20000);
});