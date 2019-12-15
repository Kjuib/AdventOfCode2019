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

function getNewPoint(current, direction) {
    if (direction === 1) {
        return { x: current.x, y: current.y + 1 };
    } else if (direction === 2) {
        return { x: current.x, y: current.y - 1 };
    } else if (direction === 3) {
        return { x: current.x - 1, y: current.y };
    } else if (direction === 4) {
        return { x: current.x + 1, y: current.y };
    } else {
        console.log('UNKNOWN DIRECTION', direction);
    }
}

function getNewInputCommand(currentInputCommand) {
    // if (currentInputCommand === 1) return 4;
    // if (currentInputCommand === 2) return 3;
    // if (currentInputCommand === 3) return 1;
    // if (currentInputCommand === 4) return 2;
    return _.random(1, 4);
}

function printMap(map, currentPoint) {
    let print = '';
    for (let y = 0; y < map.length; y++) {
        const row = map[y] || [];
        for (let x = 0; x < row.length; x++) {
            if (x === currentPoint.x && y === currentPoint.y) {
                print += 'D';
            } else {
                print += row[x] || ' ';
            }
        }
        print += '\n';
    }

    console.log(print);
}

function main() {
    const input = loadInput();
    const map = [];

    let currentPoint = { x: 25, y: 25 };
    _.set(map, `[${currentPoint.y}][${currentPoint.x}]`, 'S');

    let currentInputCommand = 1;
    let isCheckingForWalls = true;
    const inputCommands = [ currentInputCommand ];

    const print = _.throttle(printMap, 2000);
    const handleOutput = (output) => {
        if (output === 0) {
            const wallPoint = getNewPoint(currentPoint, currentInputCommand);
            _.set(map, `[${wallPoint.y}][${wallPoint.x}]`, '#');

            currentInputCommand = getNewInputCommand(currentInputCommand, map);
            inputCommands.push(currentInputCommand);
        } else if (output === 1) {
            currentPoint = getNewPoint(currentPoint, currentInputCommand);
            _.set(map, `[${currentPoint.y}][${currentPoint.x}]`, '.');

            currentInputCommand = getNewInputCommand(currentInputCommand, map);
            inputCommands.push(currentInputCommand);
        } else if (output === 2) {
            currentPoint = getNewPoint(currentPoint, currentInputCommand);
            console.log('FOUND', JSON.stringify(currentPoint));
        } else {
            console.log('UNKNOWN OUTPUT', output);
        }

        print(map, currentPoint);
    };

    compute(input, inputCommands, handleOutput);

    printMap(map, currentPoint);
}

main();

// FOUND {"x":84,"y":120}
// 280 too low
// 302
// 303 too high
