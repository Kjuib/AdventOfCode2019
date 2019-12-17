const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    return _(fileInput)
        .trim()
        .split(',')
        .map(_.toInteger)
        ;
}

function getCommand(commandNumber) {
    return {
        command: commandNumber % 100,
        mode1: (_.round(commandNumber / 100) % 10),
        mode2: (_.round(commandNumber / 1000) % 10),
        mode3: (_.round(commandNumber / 10000) % 10),
    }
}

function compute(input, inputCommands, handleOutput = _.noop) {
    let relativeBase = 0;
    let output;

    function getParam(command, i, paramNumber) {
        const mode = command['mode' + paramNumber];
        if (mode === 2) {
            return input[relativeBase + input[i + paramNumber]] || 0;
        } else if (mode === 1) {
            return input[i + paramNumber] || 0;
        } else if (mode === 0) {
            return input[input[i + paramNumber]] || 0;
        } else {
            console.log('UNKNOWN GET-PARAM STYLE', mode);
        }
    }

    function setParam(command, i, paramNumber, value) {
        const mode = command['mode' + paramNumber];
        if (mode === 2) {
            input[relativeBase + input[i + paramNumber]] = value;
        } else if (mode === 0) {
            input[input[i + paramNumber]] = value;
        } else {
            console.log('UNKNOWN SET-PARAM STYLE', mode);
        }
    }

    for (let i = 0; i < input.length; ) {
        const command = getCommand(input[i]);
        if (command.command === 1) {
            setParam(command, i, 3, getParam(command, i, 1) + getParam(command, i, 2));
            i += 4;
        } else if (command.command === 2) {
            setParam(command, i, 3, getParam(command, i, 1) * getParam(command, i, 2));
            i += 4;
        } else if (command.command === 3) {
            setParam(command, i, 1, inputCommands.shift());
            i += 2
        } else if (command.command === 4) {
            output = getParam(command, i, 1);
            handleOutput(output);
            i += 2
        } else if (command.command === 5) {
            if (getParam(command, i, 1)) {
                i = getParam(command, i, 2);
            } else {
                i += 3;
            }
        } else if (command.command === 6) {
            if (!getParam(command, i, 1)) {
                i = getParam(command, i, 2);
            } else {
                i += 3;
            }
        } else if (command.command === 7) {
            const value = getParam(command, i, 1) < getParam(command, i, 2) ? 1 : 0;
            setParam(command, i, 3, value);
            i += 4;
        } else if (command.command === 8) {
            const value = getParam(command, i, 1) === getParam(command, i, 2) ? 1 : 0;
            setParam(command, i, 3, value);
            i += 4;
        } else if (command.command === 9) {
            relativeBase += getParam(command, i, 1);
            i += 2;
        } else if (command.command === 99) {
            console.log('halt');
            // halt
            i = input.length;
        }
    }

    return {
        output,
        input
    };
}

function main() {
    const input = loadInput();

    const inputCommands = [];

    let print = '';
    const handleOutput = (output) => {
        print += String.fromCharCode(output);
    };

    compute(input, inputCommands, handleOutput);

    console.log(print);

    const points = [
        [8, 42],
        [10, 38],
        [18, 46],
        [22, 48],
        [26, 48],
        [30, 50],
        [40, 42],
        [42, 34],
        [42, 38],
        [44, 30]
    ];
    console.log('Total', _.sum(_.map(points, (point) => {
        return point[0] * point[1];
    })));
}

main();
