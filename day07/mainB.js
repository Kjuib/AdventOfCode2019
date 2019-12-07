const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    // const fileInput = fs.readFileSync(input);
    const fileInput = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
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


function compute(input, inputCommands, currentPosition) {
    console.log('inputCommands', inputCommands);
    console.log('currentPosition', currentPosition);
    function getParam(command, i, paramNumber) {
        if (command['mode' + paramNumber]) {
            return input[i + paramNumber];
        } else {
            return input[input[i + paramNumber]]
        }
    }

    let output;
    for (let i = currentPosition; i < input.length; ) {
        const command = getCommand(input[i]);
        if (command.command === 1) {
            input[input[i + 3]] = getParam(command, i, 1) + getParam(command, i, 2);
            i += 4;
        } else if (command.command === 2) {
            input[input[i + 3]] = getParam(command, i, 1) * getParam(command, i, 2);
            i += 4;
        } else if (command.command === 3) {
            console.log('inputCommands', inputCommands);
            input[input[i + 1]] = inputCommands.pop();
            i += 2
        } else if (command.command === 4) {
            output = getParam(command, i, 1);
            currentPosition = i;
            console.log('output:', output);
            // i += 2
            i = input.length;
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
            currentPosition = -1;
            // halt
            i = input.length;
        } else {
            console.log('UNKNOWN COMMAND', command);
        }
    }

    return {
        output,
        currentPosition
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
    let responses = [];
    while (_.get(responses, '[4].currentPosition', 0) >= 0) {
        let previousResponse = _.get(responses, '[4]');
        _.forEach(sequence, (inputA, index) => {
            const inputCommands = [];
            inputCommands.push(_.get(previousResponse, 'output') || 0);
            if (_.get(previousResponse, 'currentPosition', 0) === 0) {
                inputCommands.push(inputA);
            }
            previousResponse = compute(input, inputCommands, _.get(responses, `[${index}.currentPosition`) || 0);
            responses[index] = previousResponse;
            console.log('response', previousResponse);
        });
    }
    return _.get(responses, '[4].output');
}

function main() {
    const input = loadInput();

    // const sequences = permute([5,6,7,8,9]);
    const sequences = [ [ 9,8,7,6,5 ] ];
    const results = _.map(sequences, (sequence) => {
        return calcFromSequence(input, sequence);
    });
    const max = _.max(results);
    console.log('max', max);
}

main();
