const logger = require("./logger.js");

const SESSION_CAS_NAME = "gt-cas";
module.exports.sessionCasName = SESSION_CAS_NAME;

module.exports.bounce = function(redirect) {
    return (req, res, next) => {
        if (process.env.DEV === "true") {
            logger.warn("DEV set to true.");
            next();
            return;
        }

        if (req.session[SESSION_CAS_NAME]) {
            // Session has been logged in and authenticated
            next();
        } else {
            res.redirect(
                "/auth/login" + (redirect === undefined ? "" : redirect)
            );
        }
    };
};
