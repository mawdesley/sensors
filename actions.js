const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;
const TWENTY_HOURS = 20 * 60 * 60 * 1000;

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