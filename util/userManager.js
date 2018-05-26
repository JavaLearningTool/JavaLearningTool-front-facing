const cas = require("../util/cas");

module.exports.getUser = session => {
    return session[cas.sessionCasName];
};

module.exports.loggedIn = session => {
    return session[cas.sessionCasName] !== undefined;
};

module.exports.isAdmin = session => {
    return session.admin;
};
