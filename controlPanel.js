const express = require("express");
const { readFileSync } = require("fs");
const app = express();
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const VALID_ACTUATORS = [5, 6, 7, 8];
const VALID_STATES = [0, 1];

const readActuator = async actuatorId => {
    return parseInt((await execAsync(`ioplus 0 relrd ${actuatorId}`)).stdout.toString());
}
const writeActuator = async (actuatorId, state) => {
    await execAsync(`ioplus 0 relwr ${actuatorId} ${state}`);
}

app.get("/", (req, res) => {
    const page = readFileSync("./index.html").toString();
    res.send(page)
})

app.get("/status", async (req, res) => {
    const results = {};
    for (const actuatorId of VALID_ACTUATORS) {
        results[actuatorId] = await readActuator(actuatorId);
    }
    res.json(results);
});


app.get("/:actuatorId/:state", async (req, res) => {
    const actuatorId = parseInt(req.params.actuatorId);
    if (!VALID_ACTUATORS.includes(actuatorId)) {
        res.status(400).send("Invalid actuator ID");
        return;
    }

    const state = parseInt(req.params.state);
    if (!VALID_STATES.includes(state)) {
        res.status(400).send("Invalid state");
        return;
    }

    await writeActuator(actuatorId, state);
    res.send("OK");
});


app.listen(8080);
