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

const tiles = {
    0: ' ',
    1: '#',
    2: '.',
    3: '-',
    4: 'o'
};

function printMap(map) {
    let print = '';
    for (let y = 0; y < map.length; y++) {
        const row = map[y] || [];
        for (let x = 0; x < row.length; x++) {
            const c = row[x] || tiles[0];
            print += c;
        }
        print += '\n';
    }

    console.log(print);
}

function updateInputCommands(inputCommands, currentPaddle, currentBall) {
    if (!currentPaddle || !currentBall) {
        return;
    }

    if (currentPaddle.x < currentBall.x) {
        inputCommands.push(1);
    } else if (currentPaddle.x > currentBall.x) {
        inputCommands.push(-1);
    } else {
        inputCommands.push(0);
    }
}

function main() {
    const input = loadInput();
    const inputCommands = [1];
    const map = [];
    let currentBall;
    let currentPaddle;

    let currentOutputCommands = [];
    const handleOutput = (output) => {
        currentOutputCommands.push(output);
        if (_.size(currentOutputCommands) === 3) {
            const item = {
                x: currentOutputCommands[0],
                y: currentOutputCommands[1],
                c: currentOutputCommands[2]
            };

            if (item.x === -1 && item.y === 0) {
                console.log('SCORE', item.c);
            } else {
                _.set(map, `[${item.y}][${item.x}]`, tiles[item.c]);

                if (item.c === 4) {
                    currentBall = item;
                    updateInputCommands(inputCommands, currentPaddle, currentBall);
                    printMap(map);
                } else if (item.c === 3) {
                    currentPaddle = item;
                }
            }

            currentOutputCommands = [];
        }
    };

    // insert quarters
    input[0] = 2;

    compute(input, inputCommands, handleOutput);
}

main();
