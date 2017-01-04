/**
 * Created by emol on 1/1/17.
 */
import {Enum} from 'enumify';
import {Player} from './Player.js';
import {Game} from './Game';
const ProgressCardType = Object.freeze({"Science":1, "Trade":2, "Politics":3});
const MaxCardsNum = 4;

class ProgressCardDeck{
    constructor(){
        /**
         * initially there are 54 cards in bank
         */
        this.SciCardsInBank = [];
        this.TradeCardsInBank = [];
        this.PoliCardsInBank = [];
    }


    /**
     *
     * @param player
     * @param dice
     * @returns undefined if player cannot draw a progress card
     *          else ProgressCardType
     */
    isAbleToDrawProgressCard(player, dice){
        if (player.progressCardsCnt = MaxCardsNum){
            return undefined;
        }
        //TODO: test if player is able to draw progress card
        return ProgressCardType.Politics;
    }

    /**
     * player draws a progress card, the card is removed from cardsInBank
     *
     */
    drawProgressCard(player, ProgressCardType){
        let cards = (ProgressCardType == ProgressCardType.Politics) ? this.PoliCardsInBank :
                    (ProgressCardType == ProgressCardType.Science) ? this.SciCardsInBank :
                                                                    this.TradeCardsInBank;

        let random = Math.random() * cards.length;

        let card = player.progressCards.push((cards.splice(random,1))[0]);
        player.progressCardsCnt++;
        //TODO: some card has to be played immediately
/**
        switch (card){
            case 'Alche'
        }**/
    }

}
/**
{
    "Trade":{"CommercialHarbor":1, "MasterMerchant":2, "Merchant":3, "MerchantFleet":4, "ResourceMonopoly":5, "TradeMonopoly":6},
    "Politics":{"Bishop":1, "Constitution":2, "Diplomat":3, "Deserter":4, "Intrigue":5, "Saboteur":6, "Spy":7, "Wedding":9, "Warlord":8},
    "Science":{"Alchemist":1, "Crane":2, "Inventor":3, "Irrigation":4, "Engineer":5, "Medicine":6, "Mining":7, "Printer":8, "RoadBuilding":9, "Smith":10}**/
class ProgressCard extends Enum{}
ProgressCard.initEnum({

    Alchemist:{
        description:'This is the only progress card you can play before you roll the dice. It allows you to choose the results of both production dice. Then, roll the event die as normal and resolve the event.',
        detail:'When you play this card, take the red and yellow dice and turn them so the result you want is face up. You can even make the dice roll “7.” However, the event has to be resolved first. Then players receive their production as normal. You may not play this card after you roll the dice.',

        /**
         * the current player of the game play this card
         * @param game
         */
        play(game){
            if (game.diceRolled) throw "You cannot play Alchemist after you rolled the dice!";
            let productionDice = getUserInputForProDice();
            //TODO:getUserInputForProDice, returns a list of 2 integer
            setDice(productionDice);
        }


    }


});