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
            console.log('inputCommands', inputCommands);
            setParam(command, i, 1, inputCommands.shift());
            i += 2
        } else if (command.command === 4) {
            output = getParam(command, i, 1);
            console.log('output:', output);
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

function getColor(point, ship) {
    let row = ship[point.y];
    if (!row) {
        row = [];
        ship[point.y] = row;
    }
    let color = row[point.x];
    if (!color) {
        color = 0;
        row[point.x] = 0;
    }
    return color;
}

function setColor(color, point, ship) {
    getColor(point, ship);
    ship[point.y][point.x] = color;
}

function turnLeft(point) {
    if (point.facing === 'up') {
        point.facing = 'left';
        point.x += -1;
    } else if (point.facing === 'left') {
        point.facing = 'down';
        point.y += -1;
    } else if (point.facing === 'down') {
        point.facing = 'right';
        point.x += 1;
    } else if (point.facing === 'right') {
        point.facing = 'up';
        point.y += 1;
    } else {
        console.log('UNKNOWN DIRECTION', point);
    }
}

function turnRight(point) {
    if (point.facing === 'up') {
        point.facing = 'right';
        point.x += 1;
    } else if (point.facing === 'left') {
        point.facing = 'up';
        point.y += 1;
    } else if (point.facing === 'down') {
        point.facing = 'left';
        point.x += -1;
    } else if (point.facing === 'right') {
        point.facing = 'down';
        point.y += -1;
    } else {
        console.log('UNKNOWN DIRECTION', point);
    }
}

function logPoint(point, history) {
    const str = `(x:${point.x},y:${point.y})`;
    if (!history[str]) {
        history[str] = 1;
    } else {
        history[str]++;
    }
}

function main() {
    const input = loadInput();
    const current = { x: 100, y: 100, facing: 'up' };
    const ship = [];
    const inputCommands = [ getColor(current, ship) ];
    const history = {};

    let currentOutputCommands = [];
    const handleOutput = (output) => {
        currentOutputCommands.push(output);
        if (_.size(currentOutputCommands) === 2) {
            const color = currentOutputCommands[0];
            const direction = currentOutputCommands[1];

            setColor(color, current, ship);
            logPoint(current, history);
            if (direction) {
                turnRight(current);
            } else {
                turnLeft(current);
            }

            inputCommands.push(getColor(current, ship));

            currentOutputCommands = [];
        }
    };

    compute(input, inputCommands, handleOutput);

    console.log('Panel Count:', _.size(history));
}

main();
