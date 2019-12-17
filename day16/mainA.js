const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    // const fileInput = '69317163492948606335995924319873';

    return _(fileInput)
        .trim()
        .split('')
        .map(_.parseInt)
    ;
}

function getBasePattern(outputIndex) {
    const key = [ 0, 1, 0, -1 ];
    const pattern = [];
    _.forEach(key, (keyItem) => {
        _.times(outputIndex + 1, () => {
            pattern.push(keyItem);
        });
    });

    return _.concat(_.tail(pattern), pattern);
}

function getNewInputIndex(inputIndex, outputIndex) {
    return inputIndex % (4 * (outputIndex + 1));
}

function getOutputDigit(input, outputIndex) {
    const basePattern = getBasePattern(outputIndex);
    const valueMap = _.map(input, (value, index) => {
        const inputIndex = getNewInputIndex(index, outputIndex);
        return value * basePattern[inputIndex];
    });

    const total = _.sum(valueMap);

    return _.parseInt(_.last(String(total)));
}

function step(input) {
    return _.map(input, (value, outputIndex) => {
        return getOutputDigit(input, outputIndex);
    });
}

function print(input) {
    return console.log('output', input.join(''));
}

function main() {
    let input = loadInput();

    _.times(100, () => {
        input = step(input);
    });

    print(_.slice(input, 0, 8));
}

main();
