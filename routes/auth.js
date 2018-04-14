const express = require("express");
const router = express.Router();
const request = require("request");

const logger = require("../logger.js");

const sessionCasName = require("../cas").sessionCasName;
const parseXML = require("xml2js").parseString;
const XMLprocessors = require("xml2js/lib/processors");

const admins = process.env.ADMIN_IDS.split(",");

function getServiceString(protocol, host, redirect) {
    let service = protocol + "://" + host + "/auth/authenticate";
    if (redirect !== undefined) {
        service += "/" + redirect;
    }

    service = service.replace(/\//, "%2F");
    service = service.replace(/:/, "%3A");
    return service;
}

router.get("/login/:redirect?", function(req, res, next) {
    let service = getServiceString(req.protocol, req.get("host"), req.params.redirect);

    res.redirect("https://login.gatech.edu/cas/login?service=" + service);
});

router.get("/authenticate/:redirect?", function(req, res, next) {
    let authCallback = (err, user) => {
        if (err) {
            res.json("Failed to authenticate");
            return;
        }

        req.session[sessionCasName] = user;
        if (admins.indexOf(user) >= 0) {
            req.session.admin = true;
        }

        res.redirect("/" + (req.params.redirect === undefined ? "" : req.params.redirect));
    };

    let service = getServiceString(req.protocol, req.get("host"), req.params.redirect);

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
                    if (err) {
                        return authCallback(new Error("Response from CAS server was bad."));
                    }
                    try {
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
