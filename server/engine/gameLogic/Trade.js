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