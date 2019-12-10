const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';
// const input = './inputTest.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);
    return _(fileInput)
        .trim()
        .split('\n')
        .map((row) => {
            return _.split(row, '');
        })
    ;
}

function setupMap(input) {
    return _.map(input, (row, y) => {
        return _.map(row, (spot, x) => {
            return {
                x,
                y,
                value: spot,
                isAsteroid: spot === '#',
                inSight: [],
                count: 0
            };
        });
    });
}

function scanMap(map) {
    _.forEach(map, (row) => {
        _.forEach(row, (spot) => {
            scan(spot, map);
        });
    });
}

function scan(spot, map) {
    if (!spot.isAsteroid) {
        return;
    }

    _.forEach(map, (row) => {
        _.forEach(row, (other) => {
            if (spot !== other && other.isAsteroid) {
                const yDiff = spot.y - other.y;
                const xDiff = spot.x - other.x;
                let slope = _.round(yDiff / xDiff, 6);
                if (slope === Number.POSITIVE_INFINITY) {
                    slope = 'F';
                } else if (slope === Number.NEGATIVE_INFINITY) {
                    slope = '-F';
                }
                slope = String(slope);
                slope += xDiff > 0 ? '+' : '-';
                slope += yDiff > 0 ? '+' : '-';
                if (!_.includes(spot.inSight, slope)) {
                    spot.inSight.push(slope);
                    spot.count++;
                }
                other.slope = slope;
            }

            if (spot === other) {
                other.slope = '@';
            }
            if (!other.isAsteroid) {
                other.slope = '.'
            }
        });
    });
}

function printMap(map, toPrint = 'value') {
    let paper = '';
    _.forEach(map, (row) => {
        _.forEach(row, (spot) => {
            paper += spot[toPrint];
            paper += '\t';
        });
        paper += '\n';
    });
    console.log(paper);
}

function main() {
    const input = loadInput();

    const map = setupMap(input);
    printMap(map);

    // scan(map[2][2], map);
    // printMap(map, 'slope');
    scanMap(map);
    printMap(map, 'count');

    const flatMap = _.flatten(map);
    const winner = _.maxBy(flatMap, 'count');

    console.log('winner', `(${winner.x},${winner.y}) with ${winner.count}`);
}

main();
