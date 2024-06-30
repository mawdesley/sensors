const collectData = async (dataFns) => {
    if (!dataFns) return {};

    const data = {};
    for (const [key, fn] of Object.entries(dataFns)) {
        data[key] = await fn();
    }
    return data;
};

const processAction = async ({ action, data }) => {
    const collectedData = await collectData(data);
    console.log("collected data", collectedData);
    const followups = await action(collectedData);
    console.log("followups", followups);

    for (const followup of followups || []) {
        await processAction(actions[followup]);
    }
}

module.exports = ({ actions }) => {
    Object.values(actions)
        .filter(action => action.interval)
        .map(action => {
            setInterval(() => processAction(action), action.interval);
        });
};;