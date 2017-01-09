// handling PayPal Processing

// load up dependencies
var _               = require("underscore");
var multer          = require('multer');
var validateMember  = require('../middleware/isMember.js');
var uuid            = require('node-uuid');
var PayPal          = require('paypal-express-checkout-simple');
var Payment         = require('../../models/payment.js');


// PayPal settings
// !IMPORTANT: when switch back from sandbox to production, on client-side:
// 1) change 'merchant ID' (standard.js)
// 2) remove in line 'environment: "sandbox" (standard.js)
// 3) change the parameters below
var url_prefix      = 'http://localhost:3000';
var API_username    = 'zsc_dieu-facilitator_api1.hotmail.com';
var API_password    = 'FUEXAAZHPK7QN78K';
var API_signature   = 'AFcWxV21C7fd0v3bYYYRCpSSRl31AuH6mYCwM8i0xH8AZxnavZ2IpTQU';
var useSandbox      = true;
var inContext       = true; // popup instead of redirect
// var API_username    = 'zsc_dieu_api1.hotmail.com';
// var API_password    = '5EN69DJUKPSXTLH6';
// var API_signature   = 'Ah9ky-QsYxsJOdATgG-C2E4Lz.awA0f9kqGwjHko-KIU-GxCee6qd3NA';



// round a number to certain decimals
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// return the PayPal transaction fee
function transactionFee(price){
    return round(parseInt(price)*2.9/100+0.3, 2);
}

// add query string to a URL
function updateUrlQuery(key, value, url) {
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else return url;
    }
}





// ------------------------------- Purchase Settings -------------------------------

// Stuffs we are selling
var shop = {
    '5 Peer Bucks': {
        price: 5.00,
        bucks_gained: 5
    },
    '10 Peer Bucks': {
        price: 10.00,
        bucks_gained: 10
    },
    '20 Peer Bucks': {
        price: 20.00,
        bucks_gained: 20
    },
    '50 Peer Bucks': {
        price: 50.00,
        bucks_gained: 50
    }
};

// Prices are in US Dollars
var currency = 'USD';





module.exports = function(app){

    // Purchase Peer Bucks
    app.post('/checkout', validateMember(), function(req, res) {

        // make sure necessary parameters are given
        if (!req.body.product || !req.body.currentUrl) {
            return res.end();
        }

        // make sure user wants a legitimate product (that is, among our choices)
        var name = req.body.product;
        if (!_.has(shop, name)){
            return res.end;
        }

        // Extract which product user is purchasing
        var product = shop[name];
        var price = round(product.price, 2);
        var transaction = transactionFee(product.price);
        var total = price + transaction; // total price we are charging

        // create paypal object in sandbox mode. If you want non-sandbox remove tha last param.
        var paypal = PayPal.create(API_username, API_password, API_signature, useSandbox, inContext);

        // setPayOptions(brandName, hdrImageUrl, logoUrl, backgroundColor, cartBorderColor, requireShipping, noShipping, allowNote)
        paypal.setPayOptions('PeerAnswer', null, null, '00ff00', 'eeeeee');

        paypal.setProducts([{
            name: name,
            quantity: 1,
            amount: total
        }]);

        // Invoice must be unique.
        var invoice = uuid.v4();
        // redirect after paypal finishes
        var currentUrl = req.body.currentUrl;
        var returnUrl = url_prefix + '/paypal/success?previous_url=' + currentUrl;
        var cancelUrl = url_prefix + '/paypal/cancel?previous_url=' + currentUrl;
        paypal.setExpressCheckoutPayment(
            null,
            invoice,
            total,
            name,
            currency,
            returnUrl,
            cancelUrl,
            false,
            function(err, data) {
            if (err || !data || !data.token) {
                console.log('paypal.setExpressCheckoutPayment err', err, data);
                res.end();
            }
            else {
                // send client back token
                res.end(data.token);
            }
        });
    });


    // Cancel payment (Payment failed)
    app.get('/paypal/cancel', validateMember(), function(req, res) {
        console.log('Payment Canceled By', req.session.user.username);
        var previous_url = req.query.previous_url;
        if (!previous_url) {
            return res.redirect('/');
        }
        var url = updateUrlQuery('payment', 'false', previous_url);
        res.redirect(url);
    });


    // Successful payment
    app.get('/paypal/success', validateMember(), function(req, res) {
        var previous_url = req.query.previous_url;
        if (!previous_url) {
            return res.redirect('/');
        }
        var paypal = PayPal.create(API_username, API_password, API_signature, true, inContext);
        paypal.getExpressCheckoutDetails(req.query.token, true, function(err, data) {

            // Payment failed due to certain error, might want indicate to user that no payment was
            // done and no money was taken from his pocket
            if (err || !data) {
                console.log('paypal.getExpressCheckoutDetails err', err, data);
                var url = updateUrlQuery('payment', 'false', previous_url);
                return res.redirect(url);
            }

            // Payment success
            else {
                // save transaction in database + give user the Peer Bucks he bought
                var product = shop[data.L_PAYMENTREQUEST_0_NAME0];
                var bucks_gained = product.bucks_gained;
                Payment.create(req.session.user.username, bucks_gained, data, function(){
                    var url = updateUrlQuery('payment', 'true', previous_url);
                    res.redirect(url);
                });
            }
        });
    });



};