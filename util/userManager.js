const cas = require("../util/cas");

const getUser = session => {
    return session[cas.sessionCasName];
};
module.exports.getUser = getUser;

const loggedIn = session => {
    return session[cas.sessionCasName] !== undefined;
};
module.exports.loggedIn = loggedIn;

const isAdmin = session => {
    return session.admin;
};
module.exports.isAdmin = isAdmin;

const sessionInfoFiller = (req, res, next) => {
    if (req.session) {
        res.locals.loggedIn = loggedIn(req.session);
        res.locals.user = getUser(req.session);
    }
    next();
};
module.exports.sessionInfoFiller = sessionInfoFiller;
