const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    // const fileInput = 'R8,U5,L5,D3\nU7,R6,D4,L4';
    // const fileInput = 'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83';
    // const fileInput = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7';
    return _(fileInput)
        .split('\n')
        .filter(_.negate(_.isEmpty))
        .map((line) => {
            return _(line)
                .split(',')
                .map((command) => {
                    return {
                        direction: _.head(command),
                        distance: _.toInteger(_.join(_.tail(command), ''))
                    }
                })
                .value()
                ;
        })
        .value()
        ;
}

function getPath(directions) {
    const path = [{x: 0, y: 0}];
    const mapInstructions = {
        U: { d: 'y', f: 1 },
        R: { d: 'x', f: 1 },
        D: { d: 'y', f: -1 },
        L: { d: 'x', f: -1 }
    };

    _.forEach(directions, (direction) => {
        const current = _.last(path);
        const instructions = mapInstructions[direction.direction];
        for(let i = 1; i <= direction.distance; i++) {
            const newPosition = _.clone(current);
            newPosition[instructions.d] += (i * instructions.f);
            path.push(newPosition);
        }
    });

    return _.tail(path);
}

function main() {
    const [ directionsA, directionsB ] = loadInput();

    const pathA = getPath(directionsA).map(JSON.stringify);
    console.log('pathA', pathA);

    const pathB = getPath(directionsB).map(JSON.stringify);
    console.log('pathB', pathB);

    let intersections = _.intersection(pathA, pathB);
    intersections = _.map(intersections, (intersection) => {
        const pathASteps = _.indexOf(pathA, intersection);
        const pathBSteps = _.indexOf(pathB, intersection);
        return pathASteps + pathBSteps + 2; // 2 for the first and last point
    });

    console.log('Closest intersection:', _.min(intersections));
}

main();
