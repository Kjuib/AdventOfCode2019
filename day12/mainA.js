const _ = require('lodash');

const inputA = [
    { x: 13,    y: 9,   z: 5    },
    { x: 8,     y: 14,  z: -2   },
    { x: -5,    y: 4,   z: 11   },
    { x: 2,     y: -6,  z: 1    }
];

const inputTest = [
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

    console.log('moons', moons);
}

function getEnergy(moons) {
    return _.reduce(moons, (energy, currentMoon) => {
        const potEnergy = Math.abs(currentMoon.x) + Math.abs(currentMoon.y) + Math.abs(currentMoon.z);
        const kenEnergy = Math.abs(currentMoon.velx) + Math.abs(currentMoon.vely) + Math.abs(currentMoon.velz);
        return energy + (potEnergy * kenEnergy);
    }, 0);
}

function main() {
    const moons = inputA;
    resetVel(moons);

    _.times(1000, () => {
        step(moons);
    });

    console.log('Energy:', getEnergy(moons));
}

main();
