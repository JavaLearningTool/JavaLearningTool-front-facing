const express = require("express");
const router = express.Router();
const request = require("request");
const cas = require("../util/cas");
const userManager = require("../util/userManager");

const logger = require("../logger.js");

const Challenge = require("../models/challenge.js");
const Attempt = require("../models/challenge_attempt.js");
const Category = require("../models/challenge_category.js");
const Message = require("../models/message.js");

const compilationErrorMessage = "Compilation failed. Try again later.";

/**
 * Route for the home page.
 */
router.get("/", async function(req, res, next) {
    try {
        // Fetch featured categories and visible messages
        let [categories, messages] = await Promise.all([
            Category.findFeatured(),
            Message.findVisible()
        ]);

        // render the home page
        res.render("home", {
            title: "Home",
            categories,
            messages,
            styles: ["mainStyle"],
            scripts: []
        });
    } catch (err) {
        logger.error("Error querying featured categories or visible messages in / route. ", err);
        next();
        // TODO render error page.
        return;
    }
});

/**
 * Route made for load testing compilation
 */
router.post("/testCompile", function(req, res, next) {
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
            // Callback function that handles results
            if (error) {
                logger.error("Error communicating with compiler route. ", error);
                res.json({ error: compilationErrorMessage });
                return;
            }

            logger.debug(body);
            try {
                // Try to parse the results and return them
                let parsed = JSON.parse(body);
                res.json(parsed);
            } catch (err) {
                res.json(body);
            }
        }
    );
});

/**
 * Route for making compile posts
 *
 * Takes in user code, challenge name, and class name in the body of the post
 */
router.post("/compile", cas.checkLoggedIn("You have been logged out. Refresh page."), function(
    req,
    res,
    next
) {
    logger.debug("SRC Code: " + req.body.code);
    logger.debug("User compiling: " + userManager.getUser(req.session));

    // Debug results for when testing on device that can't properly run the compiler
    // res.json([
    //     { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n", timeout:"false", time:"32", input:"1, 2, 3" },
    //     { passed: "false", expected: "Hello W\\n", actual: "Hello World\\n", timeout:"true", time:"32", input:"1, 2, 3"  },
    //     { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n", timeout:"false", time:"32", input:"1, 2, 3" }
    // ]);

    // return;

    // Make a request to the compiler route and pass in user code, challenge name, and class name
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
            // Callback function that handles results
            if (error) {
                logger.error("Error communicating with compiler route. ", error);
                res.json({ error: compilationErrorMessage });
                return;
            }

            logger.debug(body);
            try {
                // Try to parse the results and return them
                let parsed = JSON.parse(body);

                if (Array.isArray(parsed)) {
                    let passedAll = true;
                    for (let index = 0; index < parsed.length; index++) {
                        let testCase = parsed[index];
                        logger.debug(testCase.passed);
                        if (testCase.passed === "false" || testCase.passed === false) {
                            passedAll = false;
                            break;
                        }
                    }

                    Attempt.newAttempt(
                        req.body.challenge,
                        userManager.getUser(req.session),
                        passedAll
                    );
                }

                res.json(parsed);
            } catch (err) {
                logger.error("Error parsing json from compiler. Json: ", body, err);
                res.json({ error: compilationErrorMessage });
            }
        }
    );
});

/**
 * Assure that the user is logged in before accessing any challenges
 */
router.use("/challenge/:path", function(req, res, next) {
    cas.bounce("/challenge/" + req.params.path)(req, res, next);
});

/**
 * Route for challenges page. This is where students go to attempt a challenge
 *
 * Takes in the challenges testFile as part of the url. testFile is then used to find
 * the appropriate challenge document in the db
 *
 * Example path: /challenge/HelloWorld
 * This would be the HelloWorld challenge
 */
router.get("/challenge/:path", async function(req, res, next) {
    try {
        // Try to get the challenge from the database
        let challenge = await Challenge.findWithTestFile(req.params.path);

        if (challenge === null) {
            next();
            return;
        }

        // Render the challenge page
        res.render("challenge", {
            challenge,
            title: challenge.name,
            codeBox: true,
            styles: ["codemirror", "mainStyle"],
            scripts: ["codemirror", "clike", "challengeBundle", "testResultsBundle"]
        });
    } catch (err) {
        if (err) {
            logger.error("Error finding challenge at path: ", req.params.path, err);
            next();
            // TODO Error page here
            return;
        }
    }
});

/**
 * Route for showing search results. This is used to search for challenges
 *
 * Takes in search parameters as part of the url.
 *
 * Example path: /search?name=Hello
 * This would mean the user is searching for challenges that contain the word Hello
 * in the title
 */
router.get("/search", cas.bounce("/search"), async function(req, res, next) {
    logger.debug(req.query);

    let errorHappened = false;

    // Get search parameters from query
    let name = req.query.name;
    let difficulty = req.query.difficulty;
    let categories = req.query.categories;
    let showPassed = req.query.showPassed;

    // If they are all undefined then no query was made and we want to go to search page
    // not search results page
    if (
        name === undefined &&
        difficulty === undefined &&
        categories === undefined &&
        showPassed === undefined &&
        req.query.criteria == undefined
    ) {
        next();
    } else {
        try {
            // The criteria to use in our database query
            let criteria = {};

            // The nicely formatted textual criteria to be displayed in the search
            // results page
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

            // get categories that were searched for and challenges that matched query from database
            let [responseCategories, challenges, passedChallenges] = await Promise.all([
                Category.findWithIds(criteria.categories),
                Challenge.findWithCriteria(criteria),
                Attempt.completedChallenges(userManager.getUser(req.session))
            ]);

            // Render the search results page
            res.render("searchResults", {
                title: "Search Results",
                challenges,
                categories: responseCategories,
                passedChallenges,
                showPassed,
                criteria: renderCriteria,
                styles: ["mainStyle"],
                scripts: ["searchBundle"]
            });
        } catch (err) {
            if (err) {
                logger.error("Error querying database for category in /search route. ", err);
                // TODO error page here
                next();
                return;
            }
        }
    }
});

/**
 * Route for entering search criteria
 */
router.get("/search", cas.bounce("/search"), async function(req, res, next) {
    try {
        // Retrieve all categories from db
        let categories = await Category.findAll();

        // Render search page
        res.render("search", {
            title: "Search",
            categories,
            styles: ["mainStyle"],
            scripts: ["searchBundle"]
        });
    } catch (error) {
        logger.error("Error in /search route querying for all categories. ", err);
        next();
        // TODO error page here
        return;
    }
});

module.exports = router;
