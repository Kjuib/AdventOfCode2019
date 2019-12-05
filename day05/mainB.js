const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    return _(fileInput)
        .split(',')
        .filter(_.negate(_.isEmpty))
        .map(_.toInteger)
        .value()
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

function compute(input, inputCommand) {
    function getParam(command, i, paramNumber) {
        if (command['mode' + paramNumber]) {
            return input[i + paramNumber];
        } else {
            return input[input[i + paramNumber]]
        }
    }

    for (let i = 0; i < input.length; ) {
        const command = getCommand(input[i]);
        if (command.command === 1) {
            input[input[i + 3]] = getParam(command, i, 1) + getParam(command, i, 2);
            i += 4;
        } else if (command.command === 2) {
            input[input[i + 3]] = getParam(command, i, 1) * getParam(command, i, 2);
            i += 4;
        } else if (command.command === 3) {
            input[input[i + 1]] = inputCommand;
            i += 2;
        } else if (command.command === 4) {
            console.log('output:', getParam(command, i, 1));
            i += 2;
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
            if (getParam(command, i, 1) < getParam(command, i, 2)) {
                input[input[i + 3]] = 1;
            } else {
                input[input[i + 3]] = 0;
            }
            i += 4;
        } else if (command.command === 8) {
            if (getParam(command, i, 1) === getParam(command, i, 2)) {
                input[input[i + 3]] = 1;
            } else {
                input[input[i + 3]] = 0;
            }
            i += 4;
        } else if (command.command === 99) {
            console.log('halt');
            // halt
            i = input.length;
        }
    }

    return input;
}

function main() {
    const input = loadInput();

    compute(input, 5);
}

main();
