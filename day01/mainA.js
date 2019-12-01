const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    const listInput = _.split(fileInput, '\n');
    const filteredInput = _.filter(listInput, _.negate(_.isEmpty));

    return filteredInput;
}

function calcFuel(mass) {
    let f = mass;
    f = f / 3;
    f = _.floor(f);
    f -= 2;
    return f;
}

function main() {
    const input = loadInput();

    const totalFuel = _(input)
        .map(_.toInteger)
        .map(calcFuel)
        .sum()
    ;

    console.log('totalFuel', totalFuel);
}

main();
