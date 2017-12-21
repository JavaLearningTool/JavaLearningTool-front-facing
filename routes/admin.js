var express = require('express');
var router = express.Router();

var Challenge = require('../models/challenge.js');
var Category = require('../models/challenge_category.js');

router.get('/admin', function(req, res, next) {
    
    let callbackCount = 0;
    let challenges, categories;

    let callback = function() {
        callbackCount++;
        if (callbackCount >= 2) {
            res.render("admin", { 
                categories,
                challenges,
                title: 'Admin',
                scripts: ['adminBundle']
            });
        }
    }
    
    Challenge.find({}, function(err, challs) {
        challenges = challs;
        callback();
    });
        
    Category.find({}, function(err, cats) {
        categories = cats;
        callback();
    });
});

router.get('/admin/new_category', function(req, res, next) {
    res.render("new_category", { 
        title: 'Admin',
        scripts: ['adminBundle']
    });
});

router.get('/admin/new_challenge', function(req, res, next) {
    Category.find({}, function(err, categories) {
        res.render("new_challenge", { 
            title: 'Admin',
            codeBox: true,
            scripts: [
                'adminBundle',
                'codemirror',
                'clike'
            ],
            categories
        });
    });
});

router.get('/admin/challenge/:id', function(req, res, next) {
    
    categories = [];
    challenge = {};

    let callback = function(err) {

        if (err) {
            console.log(err);
            next();
            return;
        }

        callbackCount++;
        if (callbackCount < 2) {
            return;
        }

        console.log("Challenge: " + challenge);

        res.render('challenge', {
            title: challenge.name,
            codeBox: true,
            scripts: [
                'adminBundle',
                'codemirror',
                'clike'
            ],
            challenge,
            categories
        })
    }

    Challenge.findOne({_id: req.params.id}, function(err, chall) {
        challenge = chall;
        callback(err)
    });

    Category.find({}, function(err, cats) {
        categories = cats;
        callback(err);
    });

    let callbackCount = 0;
});

router.put('/admin/category', function(req, res, next) {
    let newCat = Category({
        title: req.body.category
    });

    newCat.save(function(err) {
        if (err) console.log(err);
        res.json({});
    });
});

router.put('/admin/challenge', function(req, res, next) {
    let newChall = Challenge({
        name: req.body.name,
        description: req.body.description,
        categories: req.body.categories,
        difficulty: req.body.difficulty,
        defaultText: req.body.defaultText,
        testFile: req.body.testFile
    });

    newChall.save(function(err) {
        if (err) console.log(err);
        res.json({});
    });
});

router.delete('/admin/category/:categoryId', function(req, res, next) {
    console.log(req.params.categoryId)
    Category.findById(req.params.categoryId, function(err) {
        if (err) {
            console.log(err);
            res.json({error: true});
        } else {
            // remove category from all challenges
            Challenge.update({}, {$pull: {categories: req.params.categoryId}}, function() {
                res.json({});
            });
        }
    });
})

module.exports = router;