module.exports = influx => ({
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
            where value < 30
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
    batteryVoltage: async () => 13.7, // TODO: Implement
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
