module.exports = [
    {
        sensor: "light",
        cmd: "./readLight.py"
    },
    {
        sensor: "humidity",
        cmd: "./readHumidity.py"
    },
    {
        sensor: "soil",
        cmd: "./readSoil.py"
    },
    {
        sensor: "temperature",
        cmd: "./readTemperature.py"
    }
]