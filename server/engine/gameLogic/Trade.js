/**
 * Created by emol on 1/13/17.
 */
let Trade = module.exports = {};

/**
 *
 * @param offer     {object}
 * @param request {object}
 */
Trade.createTrade = function (offer, request) {
    let trade = {};
    trade.selling = offer;
    trade.buying = request;
}

/**
 * Buyer and seller are two player objects
 * @param buyer
 * @param seller
 * @param trade
 */
Trade.performTrade = function(buyer, seller, trade){
    let buyer_resources = buyer.resourcesAndCommodities;
    let seller_resources = seller.resourcesAndCommodities;

    //Seller gives resources to buyer
    trade.buying.keys().forEach( resource_name => {
        seller_resources[resource_name] -= trade.buying[resource_name];
        buyer_resources[resource_name] += trade.buying[resource_name];
    });

    //Buyer gives resources to seller
    trade.selling.keys().forEach( resource_name => {
        buyer_resources[resource_name] -= trade.selling[resource_name];
        seller_resources[resource_name] += trade.selling[resource_name];
    });
}