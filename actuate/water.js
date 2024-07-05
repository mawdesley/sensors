const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const startPump = () => execAsync("ioplus 0 relwr 6 on");
const stopPump = () => execAsync("ioplus 0 relwr 6 off");

module.exports = influx => {
    const recordStartPump = () =>
        influx.writePoints([
            {
                measurement: "sensors",
                fields: { value: 1 },
                tags: { sensor: "pump" }
            }
        ])

    const recordStopPump = () =>
        influx.writePoints([
            {
                measurement: "sensors",
                fields: { value: 0 },
                tags: { sensor: "pump"}
            }
        ])

    const start = async () => {
        await recordStartPump();
        await startPump();
    }

    const stop = async () => {
        await stopPump();
        await recordStopPump();
    }

    return async waterDuration => {
        await start();

        const timeout = setTimeout(stop, waterDuration);
        const cancel = async () => {
            clearTimeout(timeout);
            stop();
        }
        return cancel;
    }
}