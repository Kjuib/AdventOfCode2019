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
                orbits: []
            };
        })
        .value()
        ;
}

function findAndUpdateKids(parent, input) {
    const kids = _.filter(input, { parent: parent.name });
    _.forEach(kids, (kid) => {
        kid.orbits = _.concat(parent.orbits, parent.name);
        findAndUpdateKids(kid, input);
    });
}

function main() {
    const input = loadInput();

    const names = _.map(input, 'name');
    const parents = _.map(input, 'parent');

    const start = _.head(_.difference(parents, names));

    findAndUpdateKids({ name: start, orbits: [] }, input);

    const you = _.find(input, { name: 'YOU' });
    const san = _.find(input, { name: 'SAN' });

    const youOrbits = _.difference(you.orbits, san.orbits);
    const sanOrbits = _.difference(san.orbits, you.orbits);

    console.log('Total Hops:', _.size(youOrbits) + _.size(sanOrbits));
}

main();
