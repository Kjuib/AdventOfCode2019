const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    // const fileInput = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';
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


function compute(input, inputCommands) {
    function getParam(command, i, paramNumber) {
        if (command['mode' + paramNumber]) {
            return input[i + paramNumber];
        } else {
            return input[input[i + paramNumber]]
        }
    }

    let output;
    for (let i = 0; i < input.length; ) {
        const command = getCommand(input[i]);
        if (command.command === 1) {
            input[input[i + 3]] = getParam(command, i, 1) + getParam(command, i, 2);
            i += 4;
        } else if (command.command === 2) {
            input[input[i + 3]] = getParam(command, i, 1) * getParam(command, i, 2);
            i += 4;
        } else if (command.command === 3) {
            // console.log('inputCommands', inputCommands);
            input[input[i + 1]] = inputCommands.shift();
            i += 2
        } else if (command.command === 4) {
            output = getParam(command, i, 1);
            // console.log('output:', output);
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
            // console.log('halt');
            // halt
            i = input.length;
        }
    }

    return {
        output,
        input
    };
}

// http://homepage.math.uiowa.edu/~goodman/22m150.dir/2007/Permutation%20Generation%20Methods.pdf
function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function calcFromSequence(input, sequence) {
    let inputB = 0;
    _.forEach(sequence, (inputA) => {
        const response = compute(input, [inputA, inputB]);
        inputB = response.output;
    });
    return inputB;
}

function main() {
    const input = loadInput();

    const sequences = permute([0,1,2,3,4]);
    const results = _.map(sequences, (sequence) => {
        return calcFromSequence(input, sequence);
    });
    const max = _.max(results);
    console.log('max', max);
}

main();
