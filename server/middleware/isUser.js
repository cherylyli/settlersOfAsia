
// verify if request is from a user (either guest or member)

module.exports = function() {

    return function(req, res, next) {

        // if request comes from a user, continue operation (admin has all power of mod)
        if (req.session && req.session.user && req.session.user.username) {
            next();
        }
        // or else
        else {
            res.end();
        }

    }

};