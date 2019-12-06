const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    return _(fileInput)
        .split('\n')
        .filter(_.negate(_.isEmpty))
        .map((orbit) => {
            const planets = orbit.split(')');
            return {
                name: planets[1],
                parent: planets[0],
                orbits: 0
            };
        })
        .value()
    ;
}

function findAndUpdateKids(parent, input) {
    const kids = _.filter(input, { parent: parent.name });
    _.forEach(kids, (kid) => {
        kid.orbits = parent.orbits + 1;
        findAndUpdateKids(kid, input);
    });
}

function main() {
    const input = loadInput();

    const names = _.map(input, 'name');
    const parents = _.map(input, 'parent');

    const start = _.head(_.difference(parents, names));

    findAndUpdateKids({ name: start, orbits: 0 }, input);

    const total = _.sumBy(input, 'orbits');

    console.log('total', total);
}

main();
