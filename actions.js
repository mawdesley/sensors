const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;
const THIRTY_MINUTES = 30 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;
const TWENTY_HOURS = 20 * ONE_HOUR;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = ({
    timeSinceLastWatering,
    timeSinceSunrise,
    batteryVoltage,
    soilMoisture,
    pumpState,
    fanState,
    temperature,
    humidity,
    water,
    fan,
}) =>({
    checkWatering: {
        interval: FIFTEEN_MINUTES,
        data: {
            timeSinceLastWatering,
            timeSinceSunrise,
            batteryVoltage,
            soilMoisture,
        },
        action: ({ timeSinceLastWatering, timeSinceSunrise, batteryVoltage, soilMoisture }) => {
            if (timeSinceLastWatering < TWENTY_HOURS) {
                return;
            }

            if (timeSinceSunrise < FIVE_MINUTES) {
                return;
            }

            if (timeSinceSunrise > THIRTY_MINUTES) {
                return;
            }

            if (batteryVoltage < 12) {
                return;
            }

            if (soilMoisture > 50) {
                return;
            }

            return ["water"];
        },
    },
    water: {
        action: async () => {
            const cancel = await water.runForDuration(THIRTY_MINUTES);
        }
    },
    checkStartFan: {
        interval: FIVE_MINUTES,
        data: {
            fanState,
            pumpState,
            temperature,
            humidity,
            batteryVoltage,
        },
        action: ({ pumpState, fanState, temperature, humidity, batteryVoltage }) => {
            if (pumpState > 0) {
                return;
            }
            if (fanState > 0) {
                return ["checkFanStop"]
            }

            if (batteryVoltage > 12 && temperature > 28) {
                return ["fan"];
            }

            /*
            if (batteryVoltage > 12.5 && humidity > 80) {
                return ["fan"];
            }
            */
        },
    },
    fan: {
        action: async () => {
            await fan.start();
            return ["checkFanStop"];
        },
    },
    checkFanStop: {
        data: {
            fanState,
            pumpState,
            temperature,
            humidity,
            batteryVoltage,
        },
        action: async ({ temperature, humidity, fanState, pumpState, batteryVoltage }) => {
            if (fanState === 0) {
                return;
            }

            if (pumpState === 1) {
                return ["stopFan"];
            }

            if (batteryVoltage < 11) {
                return ["stopFan"];
            }

            if (temperature < 25 && humidity < 70) {
                return ["stopFan"];
            }

            await sleep(ONE_MINUTE);
            return ["checkFanStop"];
        },
    },
    stopFan: {
        action: async () => {
            await fan.stop();
        },
    },
}) 