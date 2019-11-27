import { } from './helper';

const Ruleset = {
    units: 3,
    turns: 10,
};

class Game {
    constructor(deck1, deck2) {
        this.deck1 = deck1;
        this.deck2 = deck2;
        this.turn = 1;
        this.log = [];
    }

    runGame() {
        this.log.push('Battle has begun!');
        this.log.push(`${this.deck1.commander.name} versus ${this.deck2.commander.name}!`);
        // Determine active units
        for (let i = 0; i < Ruleset.units; i++) {
            let result = this.deck1.units[i].cost - this.deck2.units[i].cost;
            // Adjust for types
            result += this.deck1.units[i].compareTypes(this.deck2.units[i]);
            if (result >= 0) {
                this.deck2.units[i].active = false;
            }
            if (result <= 0) {
                this.deck1.units[i].active = false;
            }
        }
        // Determine turn order
        const turnOrder = this.deck1.commander.compareTypes(this.deck2.commander);
        if (turnOrder === 1) {
            this.generateTurnArray(1);
        }
        if (turnOrder === -1) {
            this.generateTurnArray(-1);
        }

        // Activate any start of game effects
        

        // Start turn loop
        this.runLoop();
    }

    generateTurnArray(player) {
        this.turnPlayer = [];
        let currentPlayer = player;
        for (let i = 0; i < Ruleset.turns; i++) {
            this.turnPlayer.push(currentPlayer);
            currentPlayer *= -1;
        }
    }

    runLoop() {
        const currentPlayer = this.turnPlayer[this.turn];
        // Activate any start of turn effects
        
        // Attack, activate any on attack effects

        // Calculate damage, activate any on-damage effects

        // End turn, activate any end of turn effects
    }
}

export default Game;
