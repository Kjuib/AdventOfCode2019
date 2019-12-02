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

function main() {
    const input = loadInput();

    // set to '1202 program alarm' state
    input[1] = 12;
    input[2] = 2;


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

    console.log('result', input[0]);
}

main();
