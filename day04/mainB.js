const _ = require('lodash');

const input = '265275-781584';

const newInput = _(input)
    .split('-')
    .map(_.toInteger)
    .value()
;

function hasDupes(val) {
    val = _.split(val, '');

    for (let i = 0; i < val.length; i++) {
        if (val[i] ===  val[i + 1]) {
            if (val[i] !== val[i + 2] && val[i] !== val[i - 1]) {
                return true;
            }
            i++;
        }
    }

    return false;
}

function valuesIncrease(val) {
    val = _.split(val, '');
    val = _.map(val, _.toInteger);

    return _.isEqual(val, _.sortBy(val));
}

function meet(val) {
    if (val < 100000 || val > 999999) {
        return false;
    } else if (val < newInput[0] || val > newInput[1]) {
        return false;
    } else if (!hasDupes(val)) {
        return false
    } else if (!valuesIncrease(val)) {
        return false;
    }

    return true;
}

function main() {
    let current = newInput[0];
    let count = 0;
    while (current <= newInput[1]) {
        if (meet(current)) {
            count++
        }
        current++;
    }

    console.log('count', count);
}

main();
