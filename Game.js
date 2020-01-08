const { Unit, General } = require('./Cards');
const { EVENTS } = require('./Constants');

const Ruleset = {
    units: 3,
    turns: 10,
};

const constructDeck = deck => {
    const [commander, ...units] = deck;
    return {
        commander: new General(commander),
        units: units.map(id => new Unit(id)),
    };
};

const generateTurnArray = firstPlayer => Array(Ruleset.turns).fill(0).map((v, i) => (firstPlayer + i) % 2);

class Game {
    constructor(deck1, deck2) {
        this.players = [
            constructDeck(deck1),
            constructDeck(deck2),
        ];
        this.turn = 1;
        this.log = [];
    }

    log(...messages) {
        messages.forEach(message => this.log.push(message));
    }

    adjustCommanderStats({ target, ap = 0, hp = 0 }) {
        const { commander } = this.players[target];
        this.players[target].commander = {
            ...commander,
            ap,
            hp,
        };
    }

    evaluateEffects(eventInfo, units) {
        return units.reduce((event, unit) => {
            if (unit.isActive && unit.effects.has(eventInfo.type)) {
                const ability = unit.effects.get(eventInfo.type);
                if (ability.isActive && ability.duration !== 0) {
                    return ability.effect(event, this, unit);
                }
            }
            return event;
        });
    }

    runGame() {
        this.log('Battle has begun!');
        this.log(`${this.players[0].commander.name} versus ${this.players[1].commander.name}!`);
        // Determine active units
        for (let i = 0; i < Ruleset.units; i++) {
            const result = this.players[0].units[i].cost - this.players[1].units[i].cost;
            // Adjust for types
            const typeAdjustment = this.players[0].units[i].compareTypes(this.players[1].units[i]);
            this.log('Clash!');
            if ((result + typeAdjustment) > 0) {
                this.log("Player one's unit wins!");
                this.players[1].units[i].isActive = false;
            }
            else if ((result + typeAdjustment) < 0) {
                this.log("Player two's unit wins!");
                this.players[0].units[i].isActive = false;
            }
            else {
                this.log('Tie!');
                this.players[0].units[i].isActive = false;
                this.players[1].units[i].isActive = false;
            }
        }
        // Determine turn order
        const turnOrder = this.players[0].commander.compareTypes(this.players[1].commander);
        const turnOrderEvent = {
            event: EVENTS.onTurnOrderDetermination,
            forceFirst: false,
            forceSecond: false,
        };

        this.evaluateEffects(turnOrderEvent, [...this.players[0].units, ...this.players[1].units]);

        if (turnOrderEvent.forceFirst === 0 || turnOrderEvent.forceSecond === 1) {
            this.turnPlayer = generateTurnArray(0);
        }
        else if (turnOrderEvent.forceFirst === 1 || turnOrderEvent.forceSecond === 0) {
            this.turnPlayer = generateTurnArray(1);
        }
        else if (turnOrder === 1) {
            this.turnPlayer = this.generateTurnArray(0);
        }
        else if (turnOrder === -1) {
            this.turnPlayer = this.generateTurnArray(1);
        }
        else {
            this.turnPlayer = this.generateTurnArray(Math.round(Math.random()));
        }

        // Activate any start of game effects
        this.evaluateEffects(EVENTS.onGameStart, [...this.players[0].units, ...this.players[1].units]);

        // Start turn loop
        this.runLoop();
    }

    runLoop() {
        while (this.turn <= Ruleset.turns) {
            this.log(`Turn ${this.turn}`);
            const currentPlayer = this.players[this.turnPlayer[this.turn]];
            const enemyPlayer = this.players[this.turnPlayer[this.turn]](currentPlayer + 1) % 2;

            // Activate any start of turn effects
            currentPlayer.units.forEach(unit => {
                if (unit.isActive && unit.effect.turnStart) {
                    unit.effect.turnStart(this);
                }
            });

            enemyPlayer.units.forEach(unit => {
                if (unit.isActive && unit.effect.anyTurnStart) {
                    unit.effect.anyTurnStart(this);
                }
            });

            // Attack, activate any on attack effects

            // End turn, activate any end of turn effects
            if (!this.isGameOver());
            this.turn += 1;
        }
    }

    isGameOver() {
        if (this.players[0].commander.hp <= 0) {
            this.log('Player two wins!');
            return true;
        }
        if (this.players[0].commander.hp <= 0) {
            this.log('Player one wins!');
            return true;
        }
        if (this.turn === Ruleset.turns) {
            this.log('End of game!');
            if (this.players[0].commander.hp > this.players[1].commander.hp) {
                this.log('Player one has more HP!');
                this.log('Player one wins!');
            }
            else if (this.players[1].commander.hp > this.players[0].commander.hp) {
                this.log('Player two has more HP!');
                this.log('Player two wins!');
            }
            return true;
        }
        return false;
    }
}

export default Game;
