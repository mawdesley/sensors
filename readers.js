module.exports = influx => ({
    pumpState : async () => {
        const result = await influx.query(`
            select value, sensor
            from sensors
            where sensor = 'pump'
            and time > now() - 4h
            order by time desc
            limit 1;
            `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return 0;
        }

        return result[0].value;
    },
    fanState: async () => {
        const result = await influx.query(`
            select value, sensor
            from sensors
            where sensor = 'fan'
            and time > now() - 4h
            order by time desc
            limit 1;
            `, {
            placeholders: {
            }
        });
    },
    timeSinceLastWatering: async () => {
        const result = await influx.query(`
            select value, sensor
            from sensors
            where value > 0
            and sensor = 'pump'
            and time > now() - 14d
            order by time desc
            limit 1;
          `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return Number.MAX_SAFE_INTEGER;
        }

        return Date.now() - result[0].time.getTime();
    },
    timeSinceSunrise: async () => {
        const result = await influx.query(`
            select value, sensor
            from sensors
            where value < 80
            and sensor = 'light'
            and time > now() - 2d
            order by time desc
            limit 1;
          `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return Number.MAX_SAFE_INTEGER;
        }

        return Date.now() - result[0].time.getTime();
    }, 
    batteryVoltage: async () => {
        const result = await influx.query(`
            select mean(value) as value
            from sensors
            where sensor = 'battery voltage'
            and time > now() - 2m;
          `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return 12;
        }

        return result[0].value
    },
    temperature: async () => {
        const result = await influx.query(`
            select mean(value) as value
            from sensors
            where sensor = 'temperature'
            and time > now() - 2m;
          `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return 0;
        }

        return result[0].value;
    },
    humidity: async () => {
        const result = await influx.query(`
            select mean(value) as value
            from sensors
            where sensor = 'humidity'
            and time > now() - 2m;
          `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return 30;
        }

        return result[0].value;
    },
    soilMoisture: async () => {
        const result = await influx.query(`
            select mean(value) as value
            from sensors
            where sensor = 'soil'
            and time > now() - 1h;
          `, {
            placeholders: {
            }
        });

        if (!result.length) {
            return 0;
        }

        return result[0].value;
    }
});
