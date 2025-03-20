const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

module.exports = ({ influx, sensor, relay }) => {
    const relayOn = () => execAsync(`ioplus 0 relwr ${relay} on`);
    const relayOff = () => execAsync(`ioplus 0 relwr ${relay} off`);

    const recordOn = () =>
        influx.writePoints([
            {
                measurement: "sensors",
                fields: { value: 1 },
                tags: { sensor }
            }
        ])

    const recordOff = () =>
        influx.writePoints([
            {
                measurement: "sensors",
                fields: { value: 0 },
                tags: { sensor }
            }
        ])

    const start = async () => {
        await recordOn();
        await relayOn();
    }

    const stop = async () => {
        await relayOff();
        await recordOff();
    }

    return {
       start,
       stop, 

        runForDuration: async actuationDuration => {
            await start();

            const timeout = setTimeout(stop, actuationDuration);
            const cancel = async () => {
                clearTimeout(timeout);
                stop();
            }
            return cancel;
        },
    }
}