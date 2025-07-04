const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;
const THIRTY_MINUTES = 30 * ONE_MINUTE;
const FOURTY_MINUTES = 40 * ONE_MINUTE;
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
    circFanState,
    temperature,
    humidity,
    water,
    fan,
    circFan,
    dripValve,
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
            await water.start();
            await sleep(ONE_SECOND);
            await dripValve.start();
            await sleep(FOURTY_MINUTES);
            await dripValve.stop();
            await sleep(ONE_SECOND);
            await water.stop();
        }
    },
    checkStartFan: {
        interval: FIVE_MINUTES,
        data: {
            fanState,
            pumpState,
            temperature,
            batteryVoltage,
        },
        action: ({ pumpState, fanState, temperature, batteryVoltage }) => {
            if (pumpState > 0) {
                return;
            }
            if (fanState > 0) {
                return ["checkFanStop"]
            }

            if (batteryVoltage > 12 && temperature > 35) {
                return ["fan"];
            }
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


    checkStartCircFan: {
        interval: FIVE_MINUTES,
        data: {
            circFanState,
            pumpState,
            humidity,
            temperature,
            batteryVoltage,
        },
        action: ({ pumpState, circFanState, humidity, temperature, batteryVoltage }) => {
            if (pumpState > 0) {
                return;
            }
            if (circFanState > 0) {
                return ["checkCircFanStop"];
            }

            if (batteryVoltage < 13.5) {
                return;
            }

            if (humidity > 80 || temperature > 25) {
                return ["circFan"];
            }
        },
    },
    circFan: {
        action: async () => {
            await circFan.start();
            return ["checkCircFanStop"];
        },
    },
    checkCircFanStop: {
        data: {
            circFanState,
            pumpState,
            temperature,
            humidity,
            batteryVoltage,
        },
        action: async ({ circFanState, humidity, temperature, pumpState, batteryVoltage }) => {
            if (circFanState === 0) {
                return;
            }

            if (pumpState === 1) {
                return ["stopCircFan"];
            }

            if (batteryVoltage < 12) {
                return ["stopCircFan"];
            }

            if (humidity < 70 && temperature < 22) {
                return ["stopCircFan"];
            }

            await sleep(ONE_MINUTE);
            return ["checkCircFanStop"];
        },
    },
    stopCircFan: {
        action: async () => {
            await circFan.stop();
        },
    },
}) 