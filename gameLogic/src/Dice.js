/**
 * Created by emol on 1/1/17.
 */

const eventDie = Object.freeze({"BlueCityGate":1, "GreenCityGate":2, "YellowCityGate":3, "Ship":4 });
export class Dice{
    constructor(){
        this.eventDie = "Ship";
        this.yellowDie = 6;
        this.redDie = 6;
        this.productionDiceSet = false;
    }


    rollEventDie(){
        let random = Math.random() * 6;

        switch (random){
            case 0:
                this.eventDie = eventDie.BlueCityGate;
                break;
            case 1:
                this.eventDie = eventDie.GreenCityGate;
                break;
            case 2:
                this.eventDie = eventDie.YellowCityGate;
                break;
            default:
                this.eventDie = eventDie.Ship;
        }
    }

    rollProductionDice(){
        if (this.productionDiceSet) return;
        let random = Math.random() * 6 + 1;
        this.yellowDie = random;
        random = Math.random() * 6 + 1;
        this.redDie = random;
    }

    setProductionDice(yellowDie, redDie){
        this.yellowDie = yellowDie;
        this.redDie = redDie;
        this.productionDiceSet = true;
    }
}