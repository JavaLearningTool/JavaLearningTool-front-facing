const SESSION_CAS_NAME = "gt-cas";
module.exports.sessionCasName = SESSION_CAS_NAME;

module.exports.bounce = function(redirect) {
    return (req, res, next) => {
        // Session has been logged in and authenticated
        if (req.session[SESSION_CAS_NAME]) {
            next();
        } else {
            res.redirect(
                "/auth/login" + (redirect === undefined ? "" : redirect)
            );
        }
    };
};
