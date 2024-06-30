const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const THIRTY_MINUTES = 30 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;
const TWENTY_HOURS = 20 * ONE_HOUR;

module.exports = ({
    timeSinceLastWatering,
    timeSinceSinrise,
    batteryVoltage,
    soilMoisture,
    water,
}) =>({
    checkWatering: {
        interval: FIVE_MINUTES,
        data: {
            timeSinceLastWatering,
            timeSinceSinrise,
            batteryVoltage,
            soilMoisture,
        },
        action: ({ timeSinceLastWatering, timeSinceSinrise, batteryVoltage, soilMoisture }) => {
            if (timeSinceLastWatering < TWENTY_HOURS) {
                return;
            }

            if (timeSinceSinrise < FIVE_MINUTES) {
                return;
            }

            if (timeSinceSinrise > THIRTY_MINUTES) {
                return;
            }

            if (batteryVoltage < 12) {
                return;
            }

            if (soilMoisture > 60) {
                return;
            }

            return ["water"];
        },
    },
    water: {
        action: async () => {
            const cancel = await water(THIRTY_MINUTES);
        }
    }
}) 