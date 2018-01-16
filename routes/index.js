const express = require('express');
const router = express.Router();
const request = require('request');

const Challenge = require('../models/challenge.js');
const Category = require('../models/challenge_category.js');

const errorMessage = "Compilation failed. Try again later.";

/* GET home page. */
router.get('/', function(req, res, next) {
    
    Category.find({}).limit(3).exec(function(err, categories) {
        
        if (err) {
            console.log(err);
            res.json({error: errorMessage});
            return;
        }

        res.render("home", {
            title: 'Home',
            categories,
            styles: [
                'mainStyle'
            ],
            scripts: [
            ]
        });
    });
});

router.post('/compile', function (req, res, next) {
    console.log("SRC Code: " + req.body.code);

    // res.json([
    //     { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n" },
    //     { passed: "false", expected: "Hello W\\n", actual: "Hello World\\n" },
    //     { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n" }
    // ]);

    // return;

    request.post({url: 'http://' + process.env.COMPILER_ROUTE + ':8080', method: "POST", form: {src: req.body.code, challenge: req.body.challenge}}, function (error, response, body) {
        if (error) {
            console.log(error);
            res.json({error: errorMessage});
            return;
        }
        console.log(body);
        try {
            let parsed = JSON.parse(body);
            res.json(parsed);
        } catch(err) {
            console.log(err);
            res.json({error: errorMessage});
        }
    });
});

router.get('/challenge/:path', function(req, res, next) {

    Challenge.findOne({testFile: req.params.path}).populate('categories').exec(function(err, challenge) {

        if (err) {
            console.log(err);
            res.json({error: errorMessage});
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
            styles: [
                'codemirror',
                'mainStyle'
            ],
            scripts: [
                'codemirror',
                'clike',
                'challengeBundle',                
                'testResultsBundle'
            ]
        });

    })
});

router.get('/search', function(req, res, next) {
    console.log(req.query);

    let name = req.query.name;
    let difficulty = req.query.difficulty;
    let categories = req.query.categories;
    if (name === undefined && difficulty === undefined && categories === undefined && req.query.criteria == undefined) {
        next();
    } else {

        let criteria = {};
        let renderCriteria = {};
        if (name !== undefined) {
            criteria.$text = {$search: name};
            renderCriteria.name = name;
        }
        if (difficulty !== undefined) {
            criteria.difficulty = difficulty;
            renderCriteria.difficulty = difficulty;
        }
        if (categories !== undefined) {
            criteria.categories = {$in: JSON.parse(categories)}; // Is it dangerous parcing this?
            renderCriteria.categories = JSON.parse(categories);
        }

        let responseCategories, challenges, callbackCount = 0;

        let callback = function() {
            callbackCount++;
            if (callbackCount < 2) {
                return;
            }

            res.render('searchResults', {
                title: 'Search Results',
                challenges,
                categories: responseCategories,
                criteria: renderCriteria,
                styles: [
                    'mainStyle'
                ],
                scripts: ['searchBundle']
            })
        }

        Category.find({_id: criteria.categories}).exec(function(err, cats) {
            if (err) {
                console.log(err);
                res.json({error: errorMessage});
                return;
            }
            responseCategories = cats;
            callback();
        });

        Challenge.find(criteria, {score: {$meta: "textScore"}}).limit(10).sort({score: {$meta:"textScore"}}).exec(function(err, challs) {
            
            if (err) {
                console.log(err);
                res.json({error: errorMessage});
                return;
            }

            challenges = challs;
            callback();
        });
    }
});

router.get('/search', function(req, res, next) {

    Category.find({}, function(err, categories) {

        if (err) {
            console.log(err);
            res.json({err: errorMessage});
            return;
        }

        res.render('search', {
            title: 'Search',
            categories,
            styles: [
                'mainStyle'
            ],
            scripts: ['searchBundle']
        });
    });
});

module.exports = router;
