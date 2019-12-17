const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    // const fileInput = '03081770884921959731165446850517';

    return _(fileInput)
        .trim()
        .split('')
        .map(_.parseInt)
        ;
}

function step(input) {
    // We can assume that the 2nd half of all the base pattern is all ONEs, so it is just adding.
    for (let i = input.length - 1; i >= 0; i--) {
        input[i] = ((input[i + 1] || 0) + input[i]) % 10;
    }
    return input;
}

function print(input) {
    return console.log('output', input.join(''));
}

function main() {
    let input = loadInput();
    input = _.fill(new Array(10000), input);
    input = _.flatten(input);

    let endIndex = _.slice(input, 0, 7);
    endIndex = _.parseInt(endIndex.join(''));
    input = _.slice(input, endIndex);

    _.times(100, () => {
        input = step(input);
    });

    print(_.slice(input, 0, 8));
}

main();
