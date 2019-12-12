const _ = require('lodash');

const inputA = [
    { x: 13,    y: 9,   z: 5    },
    { x: 8,     y: 14,  z: -2   },
    { x: -5,    y: 4,   z: 11   },
    { x: 2,     y: -6,  z: 1    }
];

const inputTestA = [
    { x: -1,    y: 0,   z: 2    },
    { x: 2,     y: -10, z: -7   },
    { x: 4,     y: -8,  z: 8    },
    { x: 3,     y: 5,   z: -1   }
];

const inputTestB = [
    { x: -8,    y: -10,  z: 0    },
    { x: 5,     y: 5,    z: 10   },
    { x: 2,     y: -7,   z: 3    },
    { x: 9,     y: -8,   z: -3   }
];

function resetVel(moons) {
    _.forEach(moons, (moon) => {
        moon.velx = 0;
        moon.vely = 0;
        moon.velz = 0;
    });
}

function rateVel(currentMoon, otherMoon, dir) {
    if (currentMoon[dir] > otherMoon[dir]) {
        currentMoon[`vel${dir}`] += -1;
    } else if (currentMoon[dir] < otherMoon[dir]) {
        currentMoon[`vel${dir}`] += 1;
    }
}

function updateVel(moons) {
    _.forEach(moons, (currentMoon) => {
        _.forEach(moons, (otherMoon) => {
            rateVel(currentMoon, otherMoon, 'x');
            rateVel(currentMoon, otherMoon, 'y');
            rateVel(currentMoon, otherMoon, 'z');
        });
    });
}

function move(moons) {
    _.forEach(moons, (currentMoon) => {
        currentMoon.x += currentMoon.velx;
        currentMoon.y += currentMoon.vely;
        currentMoon.z += currentMoon.velz;
    });
}

function step(moons) {
    updateVel(moons);
    move(moons);
}

function getEnergy(moons) {
    return _.reduce(moons, (energy, currentMoon) => {
        const potEnergy = Math.abs(currentMoon.x) + Math.abs(currentMoon.y) + Math.abs(currentMoon.z);
        const kenEnergy = Math.abs(currentMoon.velx) + Math.abs(currentMoon.vely) + Math.abs(currentMoon.velz);
        return energy + (potEnergy * kenEnergy);
    }, 0);
}

function checkRepeats(moons, history, dir, stepNumber) {
    const subMoons = _.map(moons, (moon) => {
        return _.pick(moon, dir, `vel${dir}`);
    });
    const log1 = JSON.stringify(subMoons);

    if (_.includes(history[dir], log1)) {
        console.log('FOUND', dir, stepNumber);
        return stepNumber;
    } else {
        history[dir].push(log1);
        return 0;
    }
}

function calcRepeat(found) {
    const maxRepeat = found.x * found.y * found.z;

    console.log('found', found);
    console.log('maxRepeat', maxRepeat);
    _.times(_.min([found.x, found.y, found.z]), (factor) => {
        if (maxRepeat % factor === 0) {
            const repeatCheck = _.round(maxRepeat / factor);
            if (repeatCheck % found.x === 0 && repeatCheck % found.y === 0 && repeatCheck % found.z === 0) {
                console.log('FOUND REPEAT', repeatCheck);
            }
        }
    });
}

function main() {
    const moons = inputA;
    const history = {x: [], y: [], z: []};
    let count = 0;
    let found = { x: 0, y: 0, z: 0};

    resetVel(moons);

    while (!(found.x && found.y && found.z)) {
        if (!found.x) {
            found.x = checkRepeats(moons, history, 'x', count);
        }
        if (!found.y) {
            found.y = checkRepeats(moons, history, 'y', count);
        }
        if (!found.z) {
            found.z = checkRepeats(moons, history, 'z', count);
        }

        step(moons);
        count++;
    }

    calcRepeat(found);
}

main();

// inputTestA 18, 28, 44 = 9, 14, 22 = 2772
// inputTestB 2028, 4702, 5898 = 1014, 2351, 2949
