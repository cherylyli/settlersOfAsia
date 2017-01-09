// export module, a wrapper around Stripe API
var Stripe = module.exports = {};

// config
var LIVE = false; // <-- Don't forget to change client side's key too!
var PUBLIC_KEY = LIVE ? 'pk_live_68ry3yjCr4Hlj68Y78qjqSII' : 'pk_test_LQAll7pikvvVOWpHOxih8AVP';
var SECRET_KEY = LIVE ? 'sk_live_3FdppHYzfChqBQyZfo6A3paI' : 'sk_test_bvOE8tWTn03ifXII3jWGchgf';
var PERCENTAGE = 0.2;

console.log('- STRIPE MODE:', LIVE ? 'LIVE' : 'TEST');

// dependencies
var User = require('../../models/user.js');
var _ = require('underscore');
var _s = require('underscore.string');
var _h = require('../api/helper_functions.js');
var async = require('async');
var stripe = require("stripe")(SECRET_KEY);
var stripeWith = require("stripe");


// standardize currency used across all operation
var CURRENCY = 'usd';

// return public fields of a managed account object
function publicizeManaged(account){
    var acc = _.pick(account, 'country', 'legal_entity', 'transfer_schedule', 'verification');
    return acc;
}

// return public fields of a card object
function publicizeCard(card){
    var c = _.pick(card, 'id', 'funding', 'brand', 'last4');
    c.type = 'PERSONAL';
    return c;
}

// force an IP address to be valid, bypassing stripe check
function forceValidIP(ip){
    if (_h.isValidIP(ip)) return ip;
    else return '127.0.0.1';
}

// force country to be valid (for now Stripe only supports 25 countries), so account can be created
function forceValidCountry(country){
    var last_resort = 'US';
    var accepted = [
        'AU', 'CA', 'DK', 'FI', 'FR', 'IE', 'JP', 'NO', 'SG', 'ES', 'SE', 'GB', 'US', 
        'AT', 'BE', 'DE', 'HK', 'IT', 'LU', 'NL', 'PT', // open beta
        'BR', 'MX', 'NZ', 'CH' // private beta
    ];
    if (_.contains(accepted, country)) return country;
    else return last_resort;
}

// expose API
Stripe.publicizeManaged = publicizeManaged;
Stripe.publicizeCard = publicizeCard;



// removing all properties that are undefined, null or {}
function cleanObj(obj){
    _.each(obj, function(val, key){
        if (_.isUndefined(val) || _.isNull(val) || JSON.stringify(val) == '{}'){
            delete obj[key];
        }
    });
    return obj;
}




// ----------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------- //
// ------------------------------ Managed Account ------------------------------ //
// ----------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------- //

// create a stripe managed account object
function createManagedObject(account, card_token){
    var acc = {
        // update his stripe account
        legal_entity: {
            first_name  : account.first_name,
            last_name   : account.last_name,
            ssn_last_4  : account.ssn_last_4,
            address: {
                country     : account.country,
                state       : account.state,
                city        : account.city,
                line1       : account.line1,
                postal_code : account.postal_code
            },
            dob: {
                day         : account.dob_day,
                month       : account.dob_month,
                year        : account.dob_year
            }
        },
        // update his debit card
        external_account: card_token
    };
    // remove all undefined or null properties, start at deepest and iterate upwards    
    cleanObj(acc.legal_entity.address);
    cleanObj(acc.legal_entity.dob);
    cleanObj(acc.legal_entity);
    cleanObj(acc);
    return acc;
}


// create a blank managed account
Stripe.createManaged = function(country, ip, user_agent, callback){
    var options = { 
        managed: true,
        country: forceValidCountry(country),
        legal_entity: {
            type: 'individual'
        },
        tos_acceptance: {
            date : Math.floor(Date.now() / 1000), // The timestamp when the account owner accepted Stripe’s terms
            ip   : forceValidIP(ip),              // The IP address from which the account owner accepted Stripe’s terms.
            user_agent : user_agent               // The user agent of the browser from which the user accepted Stripe’s terms.
        }
    };
    stripe.accounts.create(options, callback);
};


// retrieve user's a managed account
Stripe.retrieveManaged = function(user_id, public, callback){
    User.getStripeManaged(user_id, function(managed_id){
        stripe.accounts.retrieve(managed_id, function(err, account){
            if (err) {
                console.error('Stripe.retrieveManaged err:', err, user_id);
                return callback('Error retrieving managed account.');
            }
            var cards = account.external_accounts.data;
            // if we want to return public data only, pick only certain values in account and cards
            if (public){
                cards = _.map(cards, function(card){
                    return publicizeCard(card);
                });
                account = publicizeManaged(account);
            }
            callback(null, account, cards);
        });
    });
};


// retrieve user's a managed account's balance
Stripe.retrieveBalance = function(user_id, callback){
    User.getStripeManaged(user_id, function(managed_id, secret, publishable){
        stripeWith(secret).balance.retrieve(function(err, balance){
            if (err) {
                console.error('Stripe.retrieveBalance err:', err, user_id);
                return callback('Error retrieving balance.');
            }
            callback(null, balance);
        });
    });
};


// delete a managed account
Stripe.deleteManaged = function(managed_id, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    stripe.accounts.del(managed_id, callback);
    console.log('deleting stripe managed account', managed_id);
};


// update a user's stripe managed account + debit card info
//  - For account info, we use json containing raw information
//  - For card info, which is sensitive info, we use the token generated by stripe.js
Stripe.updateManaged = function(user_id, account, card_token, callback){
    var general_err = 'An error occured. Please verify your entered info.';
    // get user's stripe id
    User.getStripeManaged(user_id, function(managed_id){
        // update his stripe managed account + debit card
        // only defined properties are being updated
        var update = createManagedObject(account, card_token);
        update.metadata = { user_id: user_id };
        // perform update
        stripe.accounts.update(managed_id, update, function(err, new_acc){
            if (err) {
                var err_msg = general_err;
                if (err.param == 'legal_entity[address][country]'){
                    err_msg = 'Country must be the same one you selected during sign up';
                }
                else {
                    err_msg = err.message;
                }
                console.error('Stripe.updateManaged -> update stripe account err:', err);
                return callback(err_msg);
            }
            callback(null, new_acc);
        });
    });
};











// ----------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------- //
// ---------------------------------- Customer --------------------------------- //
// ----------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------- //

// create a blank customer 
Stripe.createCustomer = function(callback){
    stripe.customers.create({}, callback);
};


// delete a customer
Stripe.deleteCustomer = function(customer_id, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    stripe.customers.del(customer_id, callback);
    console.log('deleting stripe customer', customer_id);
};


// get a user's customer
Stripe.getCustomer = function(user_id, callback){
    // retrieve user's customer ID
    User.getStripeCustomer(user_id, function(customer_id){
        stripe.customers.retrieve(customer_id, function(err, customer){
            if (err) {
                console.error('Stripe.getCustomer error', err);
                return callback('Error retrieving customer.');
            }
            callback(null, customer);
        });
    });
};


// add a card to user, return the card object
Stripe.addCustomerCard = function(user_id, card_token, callback){
    // retrieve user's customer ID
    User.getStripeCustomer(user_id, function(customer_id){
        // add the card to it
        stripe.customers.createSource(customer_id, { source: card_token }, function(err, card) {
            if (err){ 
                console.error('Stripe.addCustomerCard', err, user_id); 
                return callback('Error adding card.'); 
            }
            callback(null, publicizeCard(card));
        });
    });
};


// remove a card from user
Stripe.delCustomerCard = function(user_id, card_id, callback){
    // retrieve user's customer ID
    User.getStripeCustomer(user_id, function(customer_id){
        // remove the card from customer
        stripe.customers.deleteCard(customer_id, card_id, function(err, confirmation) {
            if (err){ 
                console.error('Stripe.delCustomerCard', err, user_id, card_id); 
                return callback('Error deleting card.'); 
            }
            callback(null, confirmation);
        });
    });
};


// set a card as default
Stripe.setCustomerDefaultCard = function(user_id, card_id, callback){
    // retrieve user's customer ID
    User.getStripeCustomer(user_id, function(customer_id){
        // update the customer
        stripe.customers.update(customer_id, { default_source: card_id }, function(err, customer) {
            if (err){ 
                console.error('Stripe.setCustomerDefaultCard', err, user_id, card_id); 
                return callback('Error updating card.'); 
            }
            callback(null, customer);
        });
    });
};



// get all cards of a user
Stripe.getCustomerCards = function(user_id, callback){
    // retrieve his customer object
    Stripe.getCustomer(user_id, function(err, customer){
        if (err) return callback(err);
        // return cards
        var cards = _.map(customer.sources.data, function(card){
            return publicizeCard(card);
        });
        // and the ID of default card
        callback(null, cards, customer.default_source);
    });
};



// Transfer money from A to B, platform takes 20% cut
Stripe.transfer = function(card_id, sender_id, receiver_id, amount, meta, callback){
    // validate amount (must be in sync with client-side, in wechat.js)
    var min = 5 * 100;
    var max = 1000000 * 100;
    if (amount < min || amount > max) return callback('Incorrect amount.');
    // retrieve sender's customer ID, and receiver's managed account ID
    async.parallel({
        sender: function(cb) {
            User.getStripeCustomer(sender_id, function(customer_id){
                cb(null, customer_id);
            });
        },
        receiver: function(cb){
            User.getStripeManaged(receiver_id, function(managed_id){
                cb(null, managed_id);
            });
        }
    }, function(err, ids) {
        if (err) return callback(err);
        // IDs are now retrieved
        var customer_id = ids.sender;
        var managed_id = ids.receiver;
        // calculate how much platform gets 
        // (however, in reality platform has to pay for 2.9%+0.3$ stripe fee, so net gain is platform_get minus stripe fee)
        var percentage = PERCENTAGE;
        var platform_get = Math.ceil(amount * percentage);
        // calculate how much receiver gets
        var receiver_get = Math.floor((1 - percentage) * amount);
        // metadata
        var metadata = _.extend(meta, { sender_id: sender_id, receiver_id: receiver_id, percentage: percentage });
        // charge his default card
        stripe.charges.create({
            currency        : CURRENCY,     // currency is USD
            amount          : amount,       // amount in cents
            application_fee : platform_get ,// amount of money platform takes, in cents
            customer        : customer_id,  // sender
            source          : card_id,      // sender's selected card's ID
            destination     : managed_id,   // receiver
            metadata        : metadata
        }, function(err, charge){
            if (err) {
                console.error('Stripe.chargeUser error', err); 
                return callback('Error charging card. No money was deducted.'); 
            }
            // transfer successful
            callback(null, charge, receiver_get);
        });
    }); 
};



// User.getStripeManaged('57c50542416b58a4587c3455', function(managed_id, public_key, secret_key){
//     stripe.charges.create({
//         amount: 1000,
//         currency: 'cad',
//         source: public_key
//     }, { stripe_account: managed_id }, function(err, data){
//         console.log(err);
//         console.log(data);
//     });
// });







// ----------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------- //
// ------------------------------------ Misc ----------------------------------- //
// ----------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------- //

// delete both managed and customer account
// delete both managed and customer account
Stripe.deleteManagedAndCustomer = function(managed_id, customer_id, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    async.parallel([ 
        function(cb){
            if (managed_id) Stripe.deleteManaged(managed_id, cb);
            else cb(null);
        },
        function(cb){
            if (customer_id) Stripe.deleteCustomer(customer_id, cb);
            else cb(null);
        }
    ], 
    function(err, stripe){
        if (err) callback(err);
        else callback();
    });
}

// - create a stripe managed account
// - create a stripe customer
// - bind both IDs + secret, publishable keys to a user object (me)
// This procedure is used during signup
Stripe.bindManagedAndCustomer = function(me, country, ip, user_agent, callback){
    async.parallel([ 
        function(cb){
            Stripe.createManaged(country, ip, user_agent, cb);
        },
        function(cb){
            Stripe.createCustomer(cb);
        }
    ], 
    function(err, stripe){
        stripe = stripe || [];
        var managed = stripe[0];
        var customer = stripe[1];
        // if stripe failed, delete created managed account and/or customer
        if (err || !managed || !managed.keys || !customer) {
            console.error('Stripe.createManagedAndCustomer err');
            if (err && err.message) console.error(err.message);
            if (managed) Stripe.deleteManaged(managed.id);
            if (customer) Stripe.deleteCustomer(customer.id);
            return callback(false);
        }
        // if stripe success, bind IDs + 2 keys to user
        me.stripe_managed_id = managed.id;
        me.stripe_customer_id = customer.id;
        me.stripe_secret = managed.keys.secret;
        me.stripe_publishable = managed.keys.publishable;
        callback(true);
    });
};

