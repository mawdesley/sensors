const generateActions = require('./actions');

describe("actions", () => {
    let actions;

    beforeEach(() => {
        actions = generateActions({});
    });


    describe("checkWatering", () => {
        let data;
        beforeEach(() => {
            data = {
                timeSinceLastWatering: 21 * 60 * 60 * 1000,
                timeSinceSunrise: 5 * 60 * 1000,
                batteryVoltage: 12.7,
                soilMoisture: 0.3,
            };

        })
        it("should water when all conditions are met", () => {
            expect(actions.checkWatering.action(data)).toEqual(["water"]);
        });

        it("should not water when it has already watered today", () => {
            data.timeSinceLastWatering = 19 * 60 * 60 * 1000;
            expect(actions.checkWatering.action(data)).toBeUndefined();
        });

        it("should not water when it has not been long enough since sunrise", () => {
            data.timeSinceSunrise = 4 * 60 * 1000;
            expect(actions.checkWatering.action(data)).toBeUndefined();
        });

        it("should not water when battery voltage is too low", () => {
            data.batteryVoltage = 11.9;
            expect(actions.checkWatering.action(data)).toBeUndefined();
        });

        it("should not water when soil moisture is too high", () => {
            data.soilMoisture = 0.6;
            expect(actions.checkWatering.action(data)).toBeUndefined();
        });
    });

    describe("water")
});
