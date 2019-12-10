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

                const sloper = _.find(spot.inSight, { slope: slope });
                if (sloper) {
                    sloper.count++;
                } else {
                    spot.inSight.push({
                        slope: slope,
                        count: 1
                    });
                    spot.count++;
                }
                other.slope = slope;
            }

            if (spot === other) {
                other.slope = '@';
            }
            if (!other.isAsteroid) {
                other.slope = '_'
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

function laser(slopers) {
    const quadOrder = {
        '-+': 1,
        '--': 2,
        '+-': 3,
        '++': 4
    };

    slopers.sort((a, b) => {
        const aQuad = _.slice(a.slope, -2).join('');
        const quadDiff = quadOrder[aQuad] - quadOrder[_.slice(b.slope, -2).join('')];

        if (quadDiff !== 0) {
            return quadDiff;
        }

        const aVal = Number.parseFloat(_.slice(a.slope, 0, -2).join(''));
        const bVal = Number.parseFloat(_.slice(b.slope, 0, -2).join(''));
        if (aQuad === '-+' || aQuad === '+-') {
            if (_.isNaN(aVal)) {
                return -1;
            } else if (_.isNaN(bVal)) {
                return 1;
            } else {
                return aVal - bVal;
            }
        } else if (aQuad === '--' || aQuad === '++') {
            if (_.isNaN(aVal)) {
                return 1;
            } else if (_.isNaN(bVal)) {
                return -1;
            } else {
                return aVal - bVal;
            }
        }

    });

    console.log('target200', slopers[199]);
}

function main() {
    const input = loadInput();

    const map = setupMap(input);

    scan(map[21][20], map);
    printMap(map, 'slope');
    // scanMap(map);
    // printMap(map, 'count');

    const flatMap = _.flatten(map);
    const winner = _.maxBy(flatMap, 'count');

    console.log('winner', `(${winner.x},${winner.y}) with ${winner.count}`);

    laser(winner.inSight);
}

main();

// winner (20,21) with 247

// 918 too low
