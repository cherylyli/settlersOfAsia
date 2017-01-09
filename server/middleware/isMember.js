// self-made middleware
// determine if request is sent from a member



module.exports = function(alert) {

    // alert client he must login to perform this action, default to true
    alert = alert == false ? false : true;

    return function(req, res, next) {
        // if request comes from member, continue operation
        if (req.session && req.session.user && req.session.user._id) {
            next();
        }
        // or else
        else {
            // notify user that he must login to perform current action
            // MUST NOT CHANGE THIS LINE, because the client side check specifically for this 401 response code.
            // AND the reason we do .end() and not .json("must login") is because on client-side, some response
            // handler execute functions on the returned data with the only requirement as : if (data){ do stuff.. }
            // example one callback can be: if (data){ do something with data.profile_pic }
            // so if we make the server send a string, then the above code will break because it has no attr profile_pic
            // All to say do not change the code below and the code in standard.js (client-side)
            if (alert) res.status(401).end();
            else res.end();
        }

    }

};