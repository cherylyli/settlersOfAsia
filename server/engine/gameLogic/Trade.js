/**
 * Created by emol on 1/13/17.
 */
let Trade = {} = module.exports;

/**
 *
 * @param offer {list<String>} resource/ commodity cards offered
 * @param request {list<String>} resource/ commodity cards requested
 */
Trade.createTrade = function (offer, request) {
    let trade = {};
    trade.offer = offer;
    trade.request = request;
}