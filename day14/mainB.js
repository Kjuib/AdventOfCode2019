const fs = require('fs');
const _ = require('lodash');

const input = './inputA.txt';
// const input = './inputTest.txt';

function loadInput() {
    const fileInput = fs.readFileSync(input);

    const getDetails = (str) => {
        const subStr = _.split(str, ' ');

        return {
            qty: _.toInteger(subStr[0]),
            name: subStr[1]
        };
    };

    return _(fileInput)
        .trim()
        .split('\n')
        .map((line) => {
            const items = _.split(line, ' => ');
            return {
                in: _(items[0])
                    .split(', ')
                    .map(getDetails)
                    .value(),
                out: getDetails(items[1])
            };
        })
        ;
}

function putExtras(name, qty, extras) {
    if (!extras[name]) {
        extras[name] = 0;
    }
    extras[name] += qty;
}

function getExtras(name, needQty, extras) {
    if (!extras[name]) {
        extras[name] = 0;
    }

    if (extras[name] > needQty) {
        extras[name] -= needQty;
        return 0;
    } else {
        const extraQty = extras[name];
        extras[name] = 0;
        return needQty - extraQty;
    }
}

function build(name, qty, input, extras) {
    if (qty === 0) {
        return 0;
    } else if (name === 'ORE') {
        return qty;
    }

    const buildMe = _.find(input, { out: { name: name } });
    const times = _.ceil(qty / buildMe.out.qty);
    const remainder = (times * buildMe.out.qty) - qty;
    putExtras(buildMe.out.name, remainder, extras);

    return _.sum(_.map(buildMe.in, (needMe) => {
        const needQty = getExtras(needMe.name, times * needMe.qty, extras);
        return build(needMe.name, needQty, input, extras);
    }));
}

function main() {
    // ORE to FUEL
    const input = loadInput();
    const currentOre = 1000000000000;
    let oreCount = 0;
    let fuelCount = 4906500;
    while (oreCount < currentOre) {
        oreCount = build('FUEL', ++fuelCount, input, {});
    }
    console.log('fuelCount', fuelCount - 1);
}

main();
