const express = require("express");
const router = express.Router();
const logger = require("../logger.js");
const cas = require("../util/cas");
const userManager = require("../util/userManager");
const request = require("request");
const { execSync } = require("child_process");

const Challenge = require("../models/challenge.js");
const Attempt = require("../models/challenge_attempt.js");
const Category = require("../models/challenge_category.js");
const Message = require("../models/message.js");

function newLineToBreak(str) {
    return str.replace(/\n/g, "<br>");
}

function breakToNewLine(str) {
    return str.replace(/\<br\>/g, "\n");
}

router.get("/*", cas.bounce("/admin"), function(req, res, next) {
    if (userManager.isAdmin(req.session)) {
        next();
    } else {
        res.json({ error: "access denied" });
    }
});

router.use("/*", cas.checkAdmin());

function routeMain(req, res, next) {
    let callbackCount = 0;
    let challenges, categories, messages, attempts;

    let callback = function() {
        callbackCount++;
        if (callbackCount >= 4) {
            res.render("admin", {
                categories,
                challenges,
                messages,
                attempts,
                removeHeader: true,
                title: "Admin",
                styles: ["react-table", "adminStyle"],
                scripts: ["adminBundle"],
                forwardLocals: true
            });
        }
    };

    Challenge.findAll(function(err, challs) {
        challenges = challs;
        callback();
    });

    Category.findAll(function(err, cats) {
        categories = cats;
        callback();
    });

    Message.findAll(function(err, mess) {
        messages = mess;
        callback();
    });

    Attempt.findAll(function(err, att) {
        attempts = att;
        callback();
    });
}

router.get("/", routeMain);
router.get("/tab/:selected", routeMain);

router.post("/pull", function(req, res, next) {
    try {
        execSync("bash ./scripts/pull.sh");
    } catch (err) {
        logger.error("Error pulling", err);
        res.json({ error: err });
        return;
    }

    request.post(
        {
            url: "http://" + process.env.COMPILER_ROUTE + ":8080/pull",
            method: "POST"
        },
        function(error, response, body) {
            // Callback function that handles results
            if (error || body.error) {
                error = error || body.error;
                logger.error("Error communicating with compiler route. ", error);
                res.json({ error: true });
                return;
            }

            res.json({ error: false });
        }
    );
});

router.get("/new_category", function(req, res, next) {
    res.render("new_category", {
        title: "Admin",
        removeHeader: true,
        styles: ["adminStyle"],
        scripts: ["adminBundle"]
    });
});

router.get("/new_challenge", function(req, res, next) {
    Category.findAll(function(err, categories) {
        res.render("new_challenge", {
            title: "Admin",
            codeBox: true,
            removeHeader: true,
            styles: ["codemirror", "adminStyle"],
            scripts: ["codemirror", "clike", "adminBundle"],
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
    Category.findWithId(req.params.id, function(err, category) {
        if (err) {
            logger.error("Error finding category with id: ", req.params.id, err);
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

        challenge.description = breakToNewLine(challenge.description);
        logger.debug("Challenge: " + challenge);

        res.render("patch_challenge", {
            title: challenge.name,
            codeBox: true,
            removeHeader: true,
            styles: ["codemirror", "adminStyle"],
            scripts: ["codemirror", "clike", "adminBundle"],
            challenge,
            categories
        });
    };

    Challenge.findWithId(req.params.id, function(err, chall) {
        challenge = chall;
        callback(err);
    });

    Category.findAll(function(err, cats) {
        categories = cats;
        callback(err);
    });

    let callbackCount = 0;
});

router.get("/message/:id", function(req, res, next) {
    Message.findWithId(req.params.id, function(err, message) {
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
    Category.newCategory(req.body.title, req.body.description, req.body.featured, function(err) {
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
        let newChall = Challenge.newChallenge(
            req.body.name,
            req.body.description,
            req.body.categories,
            req.body.difficulty,
            req.body.testFile,
            req.body.classes,
            function(err) {
                if (err) {
                    logger.error("Error in route /admin/challenge saving challenge. ", err);
                    res.json({ error: true });
                    return;
                }
                res.json({ error: false });
            }
        );
    } catch (err) {
        logger.error("Error in route /admin/challenge. ", err);
        res.json({ error: true });
    }
});

router.put("/message", function(req, res, next) {
    let newMess = Message.newMessage(
        req.body.title,
        req.body.body,
        req.body.links,
        req.body.visible,
        function(err) {
            if (err) {
                logger.error("Error saving new message", err);
                res.json({ error: "Request failed!" });
                return;
            }

            res.json({});
        }
    );
});

router.patch("/category/:categoryId", function(req, res, next) {
    Category.updateById(req.params.categoryId, req.body, function(err) {
        if (err) {
            logger.error("Error updating category with id: ", req.params.categoryId, err);
            res.json({ error: true });
            return;
        }
        res.json({});
    });
});

router.patch("/challenge/:challengeId", function(req, res, next) {
    Challenge.updateById(req.params.challengeId, req.body, function(err) {
        if (err) {
            logger.error("Error updating challenge with id: ", req.params.challengeId, err);
            res.json({ error: true });
            return;
        }
        res.json({});
    });
});

router.patch("/message/:messageId", function(req, res, next) {
    Message.updateById(req.params.messageId, req.body, function(err) {
        if (err) {
            logger.error("Error updating message with id: ", req.params.messageId, err);
            res.json({ error: true });
            return;
        }
        res.json({});
    });
});

router.delete("/category/:categoryId", function(req, res, next) {
    Category.removeById(req.params.categoryId, function(err) {
        if (err) {
            logger.error("Error removing category with id: ", req.params.categoryId, err);
            res.json({ error: true });
        } else {
            res.json({});
        }
    });
});

router.delete("/challenge/:challengeId", function(req, res, next) {
    Challenge.removeById(req.params.challengeId, function(err) {
        if (err) {
            logger.error("Error removing challenge with id: ", req.params.challengeId, err);
            res.json({ error: true });
        } else {
            res.json({});
        }
    });
});

router.delete("/message/:messageId", function(req, res, next) {
    Message.removeById(req.params.messageId, function(err) {
        if (err) {
            logger.error("Error removing message with id: ", req.params.messageId, err);
            res.json({ error: true });
        } else {
            res.json({});
        }
    });
});

module.exports = router;
