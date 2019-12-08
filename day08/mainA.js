const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    // const fileInput = '123456782012';
    return _(fileInput)
        .trim()
        .split('')
        .map(_.toInteger)
        ;
}

function main() {
    const input = loadInput();

    const width = 25;
    const height = 6;

    let layers = _.chunk(input, width * height);

    layers = _.map(layers, (layer) => {
        return _.countBy(layer);
    });


    const min = _.minBy(layers, '0');

    const checkSum = min[1] * min[2];

    console.log('checkSum', checkSum);
}

main();
