const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    // const fileInput = '0222112222120000';
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

    let image = _.reduce(layers, (img, layer) => {
        for (let i = 0; i < layer.length; i++) {
            if (img[i] === 2) {
                img[i] = layer[i];
            }
        }
        return img;
    });

    image = _.map(image, (digit) => {
        return digit ? '@' : ' ';
    });

    image = _.chunk(image, width);

    image = _.map(image, (row) => {
        return _.join(row, '');
    });

    image = _.join(image, '\n');

    console.log(image);
}

main();
