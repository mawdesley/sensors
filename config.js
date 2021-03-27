module.exports = [
    {
        sensor: "light",
        cmd: "./read/adc.py 7"
    },
    {
        sensor: "humidity",
        cmd: "./read/humidity.py"
    },
    {
        sensor: "soil 1",
        cmd: "./read/adc.py 8"
    },
    {
        sensor: "soil 2",
        cmd: "./read/adc.py 10"
    },
    {
        sensor: "soil 3",
        cmd: "./read/adc.py 12"
    },
    {
        sensor: "soil 4",
        cmd: "./read/adc.py 14"
    },
    {
        sensor: "co2",
        cmd: "./read/co2.py"
    },
    {
        sensor: "temperature",
        cmd: "./read/temperature.py"
    }
]