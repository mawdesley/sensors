const FIVE_MINUTES = 5 * 60 * 1000;
const TWENTY_HOURS = 20 * 60 * 60 * 1000;

module.exports = ({
    timeSinceLastWatering,
}) =>({
    checkWatering: {
        interval: FIVE_MINUTES,
        data: {
            timeSinceLastWatering,

        },
        action: ({ timeSinceLastWatering, timeSinceSinrise, batteryVoltage, soilMoisture }) => {
            if (timeSinceLastWatering < TWENTY_HOURS) {
                return;
            }

            if (timeSinceSinrise < FIVE_MINUTES) {
                return;
            }

            if (batteryVoltage < 12) {
                return;
            }

            if (soilMoisture > 0.5) {
                return;
            }

            return ["water"];
        },
    },
    water: {
        data:
    }
}) 