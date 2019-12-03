/* eslint-disable max-classes-per-file */
const { TYPES, GENERALS, UNITS } = require('./Constants');

const results = new Map([
    [[TYPES.sword, TYPES.wand], 1],
    [[TYPES.wand, TYPES.shield], 1],
    [[TYPES.shield, TYPES.sword], 1],
    [[TYPES.sword, TYPES.shield], -1],
    [[TYPES.wand, TYPES.sword], -1],
    [[TYPES.shield, TYPES.wand], -1],
]);


export class Unit {
    // Create card from id.
    constructor(id) {
        const props = UNITS[id];
        this.name = props.name;
        this.description = props.description;
        this.type = props.type;
        this.state = {
            isActive: true,
            cost: props.cost,
        };
    }

    compareTypes(unit) {
        if (this.type === unit.type) {
            return 0;
        }
        return results.get([this.type, unit.type]);
    }
}

export class General {
    // Create card from id.
    constructor(id) {
        const props = GENERALS[id];
        this.name = props.name;
        this.description = props.description;
        this.type = props.type;
        this.state = {
            hp: props.hp,
            ap: props.ap,
            canAttack: true,
        };
    }

    compareTypes(general) {
        if (this.type === general.type) {
            return 0;
        }
        return results.get([this.type, general.type]);
    }
}
