const express = require("express");
const router = express.Router();
const request = require("request");

const logger = require("../logger.js");

const sessionCasName = require("../util/cas").sessionCasName;
const parseXML = require("xml2js").parseString;
const XMLprocessors = require("xml2js/lib/processors");

const admins = process.env.ADMIN_IDS.split(",");

/**
 * Gets the service string to send to gatech cas login
 *
 * @param {string} protocol
 * @param {string} host
 * @param {string} redirect route to redirect to after logging in
 */
function getServiceString(protocol, host, redirect) {
    let service = protocol + "://" + host + "/auth/authenticate";
    if (redirect !== undefined) {
        service += "/?redirect=" + redirect;
    }

    return service;
}

/**
 * This route starts the login flow by redirecting to gatech cas
 */
router.get("/login/:redirect?", function(req, res, next) {
    if (req.query.redirect === undefined) {
        req.query.redirect = "/";
    }

    if (process.env.DEV === "true") {
        // If in dev, don't redirect to gatech cas
        logger.warn("DEV set to true.");
        res.redirect("/auth/authenticate/?redirect=" + req.query.redirect);
        return;
    }

    let service = getServiceString(req.protocol, req.get("host"), req.query.redirect);
    res.redirect("https://login.gatech.edu/cas/login?service=" + service);
});

/**
 * This is the route that gatech cas should redirect to after logging in a User.
 * It will then make a request to gatech to verify the user that just logged in
 * and get basic info.
 *
 * It will then redirect to whatever route is specified in the query params
 */
router.get("/authenticate", function(req, res, next) {
    // Create callback after verifying user that just logged in
    let authCallback = (err, user) => {
        if (err) {
            res.json("Failed to authenticate");
            return;
        }

        // Setup the session to store the user
        req.session[sessionCasName] = user;
        if (admins.indexOf(user) >= 0) {
            req.session.admin = true;
        }

        let temp = decodeURI(req.query.redirect);

        // Redirect to the desired route
        res.redirect(
            req.query.redirect === undefined ? "/" : decodeURIComponent(req.query.redirect)
        );
    };

    let service = getServiceString(req.protocol, req.get("host"), req.query.redirect);

    // If in development just log in as admin
    if (process.env.DEV === "true") {
        logger.warn("DEV set to true.");
        req.session.admin = true;
        authCallback(undefined, "testUser");
        return;
    }

    // Make the request to validate the User that just logged in
    request.get(
        {
            url:
                "https://login.gatech.edu/cas/serviceValidate?ticket=" +
                req.query.ticket +
                "&service=" +
                service,
            method: "POST"
        },
        function(error, response, body) {
            parseXML(
                body,
                {
                    trim: true,
                    normalize: true,
                    explicitArray: false,
                    tagNameProcessors: [XMLprocessors.normalize, XMLprocessors.stripPrefix]
                },
                function(err, result) {
                    // Handle response from cas server
                    if (err) {
                        // If request failed
                        return authCallback(new Error("Response from CAS server was bad."));
                    }
                    try {
                        // If auth failed
                        var failure = result.serviceresponse.authenticationfailure;
                        if (failure) {
                            return authCallback(
                                new Error("CAS authentication failed (" + failure.$.code + ").")
                            );
                        }
                        var success = result.serviceresponse.authenticationsuccess;
                        if (success) {
                            return authCallback(null, success.user, success.attributes);
                        } else {
                            return authCallback(new Error("CAS authentication failed."));
                        }
                    } catch (err) {
                        return authCallback(new Error("CAS authentication failed."));
                    }
                }
            );
        }
    );
});

module.exports = router;
