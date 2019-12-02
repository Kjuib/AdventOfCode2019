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

function compute(input) {
    for (let i = 0; i < input.length; i += 4) {
        const command = input[i];
        if (command === 1) {
            const posA = input[i + 1];
            const posB = input[i + 2];
            const posResult = input[i + 3];

            input[posResult] = input[posA] + input[posB];
        } else if (command === 2) {
            const posA = input[i + 1];
            const posB = input[i + 2];
            const posResult = input[i + 3];

            input[posResult] = input[posA] * input[posB];
        } else if (command === 99) {
            // halt
            i = input.length;
        }
    }

    return input;
}

function main() {
    const input = loadInput();

    for (let n = 0; n < 100; n++) {
        for (let v = 0; v < 100; v++) {
            const newInput = _.clone(input);
            newInput[1] = n;
            newInput[2] = v;

            const result = compute(newInput);
            if (result[0] === 19690720) {
                console.log('Found:', ((100 * n) + v));
                return;
            }
        }
    }
}

main();
