const express = require("express");
const router = express.Router();
const request = require("request");

const logger = require("../logger.js");

const Challenge = require("../models/challenge.js");
const Category = require("../models/challenge_category.js");
const Message = require("../models/message.js");

const compilationErrorMessage = "Compilation failed. Try again later.";

/* GET home page. */
router.get("/", function(req, res, next) {
    let categories, messages;
    let callbackCount = 0;

    let callback = function() {
        callbackCount++;
        if (callbackCount >= 2) {
            res.render("home", {
                title: "Home",
                categories,
                messages,
                styles: ["mainStyle"],
                scripts: []
            });
        }
    };

    Category.find({ featured: true }).exec(function(err, cats) {
        if (err) {
            logger.error("Error querying featured categories in / route. ", err);
            next();
            // TODO render error page.
            return;
        }

        categories = cats;
        callback();
    });

    Message.find({ visible: true }).exec(function(err, mess) {
        if (err) {
            logger.error("Error querying messages in / route. ", err);
            next();
            return;
        }

        messages = mess;
        callback();
    });
});

router.post("/compile", function(req, res, next) {
    logger.debug("SRC Code: " + req.body.code);

    // res.json([
    //     { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n", timeout:"false", time:"32", input:"1, 2, 3" },
    //     { passed: "false", expected: "Hello W\\n", actual: "Hello World\\n", timeout:"true", time:"32", input:"1, 2, 3"  },
    //     { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n", timeout:"false", time:"32", input:"1, 2, 3" }
    // ]);

    // return;

    request.post(
        {
            url: "http://" + process.env.COMPILER_ROUTE + ":8080",
            method: "POST",
            form: {
                src: req.body.code,
                challenge: req.body.challenge,
                className: req.body.className
            }
        },
        function(error, response, body) {
            if (error) {
                logger.error("Error communicating with compiler route. ", error);
                res.json({ error: compilationErrorMessage });
                return;
            }
            logger.debug(body);
            try {
                let parsed = JSON.parse(body);
                res.json(parsed);
            } catch (err) {
                logger.error("Error parsing json from compiler. Json: ", body, err);
                res.json({ error: compilationErrorMessage });
            }
        }
    );
});

router.get("/challenge/:path", function(req, res, next) {
    Challenge.findOne({ testFile: req.params.path })
        .populate("categories")
        .exec(function(err, challenge) {
            if (err) {
                logger.error("Error finding challenge at path: ", req.params.path, err);
                next();
                // TODO Error page here
                return;
            }

            if (challenge === null) {
                next();
                return;
            }

            res.render("challenge", {
                challenge,
                title: challenge.name,
                codeBox: true,
                styles: ["codemirror", "mainStyle"],
                scripts: ["codemirror", "clike", "challengeBundle", "testResultsBundle"]
            });
        });
});

router.get("/search", function(req, res, next) {
    logger.debug(req.query);

    let errorHappened = false;

    let name = req.query.name;
    let difficulty = req.query.difficulty;
    let categories = req.query.categories;
    if (
        name === undefined &&
        difficulty === undefined &&
        categories === undefined &&
        req.query.criteria == undefined
    ) {
        next();
    } else {
        let criteria = {};
        let renderCriteria = {};
        if (name !== undefined) {
            criteria.$text = { $search: name };
            renderCriteria.name = name;
        }
        if (difficulty !== undefined) {
            criteria.difficulty = difficulty;
            renderCriteria.difficulty = difficulty;
        }
        if (categories !== undefined) {
            criteria.categories = { $in: JSON.parse(categories) }; // Is it dangerous parcing this?
            renderCriteria.categories = JSON.parse(categories);
        }

        let responseCategories,
            challenges,
            callbackCount = 0;

        let callback = function() {
            callbackCount++;
            if (callbackCount < 2) {
                return;
            }

            res.render("searchResults", {
                title: "Search Results",
                challenges,
                categories: responseCategories,
                criteria: renderCriteria,
                styles: ["mainStyle"],
                scripts: ["searchBundle"]
            });
        };

        Category.find({ _id: criteria.categories }).exec(function(err, cats) {
            if (err) {
                logger.error("Error querying database for category in /search route. ", err);
                // TODO error page here
                next();
                return;
            }
            responseCategories = cats;
            callback();
        });

        Challenge.find(criteria, { score: { $meta: "textScore" } })
            .limit(10)
            .sort({ score: { $meta: "textScore" } })
            .exec(function(err, challs) {
                if (err) {
                    logger.error("Error querying database for challenge in /search route. ", err);
                    // TODO error page here
                    next();
                    return;
                }

                challenges = challs;
                callback();
            });
    }
});

router.get("/search", function(req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) {
            logger.error("Error in /search route querying for all categories. ", err);
            next();
            // TODO error page here
            return;
        }

        res.render("search", {
            title: "Search",
            categories,
            styles: ["mainStyle"],
            scripts: ["searchBundle"]
        });
    });
});

module.exports = router;
