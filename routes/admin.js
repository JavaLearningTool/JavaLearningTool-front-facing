const express = require("express");
const router = express.Router();
const request = require("request");
var CASAuthentication = require("cas-authentication");
var cas = new CASAuthentication({
    cas_url: "https://login.gatech.edu/cas/login",
    service_url: "https://login.gatech.edu/cas/serviceValidate"
});
const logger = require("../logger.js");

const Challenge = require("../models/challenge.js");
const Category = require("../models/challenge_category.js");
const Message = require("../models/message.js");

function newLineToBreak(str) {
    str = str.trim();
    return str.replace(/\n/g, "<br>");
}

router.use("/*", cas.bounce, function(req, res, next) {
    // if (req.session.admin) {
    //     next();
    // } else {
    //     res.redirect("../auth/login");
    // }
    console.log("Check log in");
    next();
});

function routeMain(req, res, next) {
    let callbackCount = 0;
    let challenges, categories, messages;

    let callback = function() {
        callbackCount++;
        if (callbackCount >= 3) {
            res.render("admin", {
                categories,
                challenges,
                messages,
                removeHeader: true,
                title: "Admin",
                styles: ["adminStyle"],
                scripts: ["adminBundle"],
                forwardLocals: true
            });
        }
    };

    Challenge.find({}, function(err, challs) {
        challenges = challs;
        callback();
    });

    Category.find({}, function(err, cats) {
        categories = cats;
        callback();
    });

    Message.find({}, function(err, mess) {
        messages = mess;
        callback();
    });
}

router.get("/", routeMain);
router.get("/tab/:selected", routeMain);

router.get("/new_category", function(req, res, next) {
    res.render("new_category", {
        title: "Admin",
        removeHeader: true,
        styles: ["adminStyle"],
        scripts: ["adminBundle"]
    });
});

router.get("/new_challenge", function(req, res, next) {
    Category.find({}, function(err, categories) {
        res.render("new_challenge", {
            title: "Admin",
            codeBox: true,
            removeHeader: true,
            styles: ["codemirror", "adminStyle"],
            scripts: ["adminBundle", "codemirror", "clike"],
            categories
        });
    });
});

router.get("/new_message", function(req, res, next) {
    res.render("new_message", {
        title: "Admin",
        removeHeader: true,
        styles: ["adminStyle"],
        scripts: ["adminBundle"]
    });
});

router.get("/category/:id", function(req, res, next) {
    Category.findOne({ _id: req.params.id }, function(err, category) {
        if (err) {
            logger.error(
                "Error finding category with id: ",
                req.params.id,
                err
            );
            next();
            return;
        }

        res.render("patch_category", {
            title: category.title,
            removeHeader: true,
            styles: ["adminStyle"],
            scripts: ["adminBundle"],
            category
        });
    });
});

router.get("/challenge/:id", function(req, res, next) {
    categories = [];
    challenge = {};

    let callback = function(err) {
        if (err) {
            logger.error(
                "Error in /admin/challenge/:id route with challenge id: ",
                req.params.id,
                err
            );
            next();
            return;
        }

        callbackCount++;
        if (callbackCount < 2) {
            return;
        }

        logger.debug("Challenge: " + challenge);

        res.render("patch_challenge", {
            title: challenge.name,
            codeBox: true,
            removeHeader: true,
            styles: ["codemirror", "adminStyle"],
            scripts: ["adminBundle", "codemirror", "clike"],
            challenge,
            categories
        });
    };

    Challenge.findOne({ _id: req.params.id }, function(err, chall) {
        challenge = chall;
        callback(err);
    });

    Category.find({}, function(err, cats) {
        categories = cats;
        callback(err);
    });

    let callbackCount = 0;
});

router.get("/message/:id", function(req, res, next) {
    Message.findOne({ _id: req.params.id }, function(err, message) {
        if (err) {
            logger.error("Error finding message with id: ", req.params.id, err);
            next();
            return;
        }

        res.render("patch_message", {
            title: message.title,
            removeHeader: true,
            styles: ["adminStyle"],
            scripts: ["adminBundle"],
            message
        });
    });
});

router.put("/category", function(req, res, next) {
    let newCat = Category({
        title: req.body.title,
        description: req.body.description,
        featured: req.body.featured
    });

    newCat.save(function(err) {
        if (err) {
            logger.error("Error saving new category", err);
            res.json({ error: "Request failed!" });
            return;
        }

        res.json({});
    });
});

router.post("/challenge", function(req, res, next) {
    try {
        let newChall = Challenge({
            name: req.body.name,
            description: newLineToBreak(req.body.description),
            categories: req.body.categories,
            difficulty: req.body.difficulty,
            defaultText: req.body.defaultText,
            testFile: req.body.testFile,
            className: req.body.className
        });

        newChall.save(function(err) {
            if (err) {
                logger.error(
                    "Error in route /admin/challenge saving challenge. ",
                    err
                );
                res.json({ error: true });
                return;
            }
            res.json({ error: false });
        });
    } catch (err) {
        logger.error("Error in route /admin/challenge. ", err);
        res.json({ error: true });
    }
});

router.put("/message", function(req, res, next) {
    let newMess = Message({
        title: req.body.title,
        body: req.body.body,
        links: req.body.links,
        visible: req.body.visible
    });

    newMess.save(function(err) {
        if (err) {
            logger.error("Error saving new message", err);
            res.json({ error: "Request failed!" });
            return;
        }

        res.json({});
    });
});

router.patch("/category/:categoryId", function(req, res, next) {
    Category.findByIdAndUpdate(
        req.params.categoryId,
        { $set: req.body },
        function(err) {
            if (err) {
                logger.error(
                    "Error updating category with id: ",
                    req.params.categoryId,
                    err
                );
                res.json({ error: true });
                return;
            }
            res.json({});
        }
    );
});

router.patch("/challenge/:challengeId", function(req, res, next) {
    req.body.description = newLineToBreak(req.body.description);

    Challenge.findByIdAndUpdate(
        req.params.challengeId,
        { $set: req.body },
        function(err) {
            if (err) {
                logger.error(
                    "Error updating challenge with id: ",
                    req.params.challengeId,
                    err
                );
                res.json({ error: true });
                return;
            }
            res.json({});
        }
    );
});

router.patch("/message/:messageId", function(req, res, next) {
    Message.findByIdAndUpdate(
        req.params.messageId,
        { $set: req.body },
        function(err) {
            if (err) {
                logger.error(
                    "Error updating message with id: ",
                    req.params.messageId,
                    err
                );
                res.json({ error: true });
                return;
            }
            res.json({});
        }
    );
});

router.delete("/category/:categoryId", function(req, res, next) {
    Category.findByIdAndRemove(req.params.categoryId, function(err) {
        if (err) {
            logger.error(
                "Error removing category with id: ",
                req.params.categoryId,
                err
            );
            res.json({ error: true });
        } else {
            // remove category from all challenges
            Challenge.update(
                {},
                { $pull: { categories: req.params.categoryId } },
                { multi: true },
                function(err) {
                    res.json({});
                }
            );
        }
    });
});

router.delete("/challenge/:challengeId", function(req, res, next) {
    Challenge.findByIdAndRemove(req.params.challengeId, function(err) {
        if (err) {
            logger.error(
                "Error removing challenge with id: ",
                req.params.challengeId,
                err
            );
            res.json({ error: true });
        } else {
            res.json({});
        }
    });
});

router.delete("/message/:messageId", function(req, res, next) {
    Message.findByIdAndRemove(req.params.messageId, function(err) {
        if (err) {
            logger.error(
                "Error removing message with id: ",
                req.params.messageId,
                err
            );
            res.json({ error: true });
        } else {
            res.json({});
        }
    });
});

module.exports = router;
