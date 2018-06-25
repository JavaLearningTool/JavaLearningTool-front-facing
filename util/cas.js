const logger = require("../logger.js");
const userManager = require("./userManager");

const SESSION_CAS_NAME = "gt-cas";
module.exports.sessionCasName = SESSION_CAS_NAME;

/**
 * Check if the user is logged in. If not then redirect to the log in flow.
 *
 * @param {String} redirect the route to return to once logging in is finished.
 * If no route is specified it defaults to the route from the original url.
 */
module.exports.bounce = function(redirect) {
    return (req, res, next) => {
        if (userManager.loggedIn(req.session)) {
            // Session has already been logged in and authenticated
            next();
        } else {
            if (!redirect) {
                redirect = req.originalUrl;
            }

            if (redirect.charAt(0) === "/") {
                redirect = redirect.substr(1, redirect.length);
            }
            redirect = encodeURIComponent(redirect);
            redirect = "/" + redirect;

            res.redirect("/auth/login/?redirect=" + (redirect === undefined ? req.url : redirect));
        }
    };
};

/**
 * Check if the user is logged in. If not then res.json(error: errorMessage)
 *
 * @param {String} errorMessage an errorMessage to respond with if not logged
 * in. By default the errorMessage is "You must be logged in to perform this
 * action"
 */
module.exports.checkLoggedIn = function(
    errorMessage = "You must be logged in to perform this action"
) {
    return (req, res, next) => {
        if (userManager.loggedIn(req.session)) {
            // Session has already been logged in and authenticated
            next();
        } else {
            res.json({ error: errorMessage });
        }
    };
};

/**
 * Check if the user is admin. If not then res.json(error: errorMessage)
 *
 * @param {String} errorMessage an errorMessage to respond with if not admin
 * By default the errorMessage is "You don't have access"
 */
module.exports.checkAdmin = function(errorMessage = "You don't have access") {
    return (req, res, next) => {
        if (userManager.isAdmin(req.session)) {
            // Session has already been logged in and authenticated
            next();
        } else {
            res.json({ error: errorMessage });
        }
    };
};
