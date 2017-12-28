const express = require('express');
const router = express.Router();
const request = require('request');

const Challenge = require('../models/challenge.js');
const Category = require('../models/challenge_category.js');

function newLineToBreak(str) {
    str = str.trim();
    return str.replace(/\n/g, "<br>");
}

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
                styles: [
                    'adminStyle'
                ],
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
        styles: [
            'adminStyle'
        ],
        scripts: ['adminBundle']
    });
});

router.get('/admin/new_challenge', function(req, res, next) {
    Category.find({}, function(err, categories) {
        res.render("new_challenge", { 
            title: 'Admin',
            codeBox: true,
            styles: [
                'codemirror',
                'adminStyle'
            ],
            scripts: [
                'adminBundle',
                'codemirror',
                'clike'
            ],
            categories
        });
    });
});

router.get('/admin/category/:id', function(req, res, next) {
    
    Category.findOne({_id: req.params.id}, function(err, category) {
        if (err) {
            console.log(err);
            next();
            return;
        }

        res.render('patch_category', {
            title: category.title,
            styles: [
                'adminStyle'
            ],
            scripts: [
                'adminBundle',

            ],
            category
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

        res.render('patch_challenge', {
            title: challenge.name,
            codeBox: true,
            styles: [
                'codemirror',
                'adminStyle'
            ],
            scripts: [
                'adminBundle',
                'codemirror',
                'clike'
            ],
            challenge,
            categories
        });
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
        title: req.body.title,
        description: req.body.description
    });

    newCat.save(function(err) {
        if (err) console.log(err);
        res.json({});
    });
});

router.post('/admin/challenge', function(req, res, next) {
    
    try {
        let newChall = Challenge({
            name: req.body.name,
            description: newLineToBreak(req.body.description),
            categories: req.body.categories,
            difficulty: req.body.difficulty,
            defaultText: req.body.defaultText,
            testFile: req.body.testFile
        });

        newChall.save(function(err) {
            if (err) {
                console.log(err);
                res.redirect('/admin/new_challenge');
                return;            
            }
            res.redirect('/admin');
        });
    } catch(err) {
        console.log(err);
        res.redirect('/admin/new_challenge');
    }
});


router.patch('/admin/category/:categoryId', function(req, res, next) {
    Category.findByIdAndUpdate(req.params.categoryId, {$set: req.body}, function(err) {
        if (err) {
            console.log(err);
            res.json({error: true});
            return;
        }
        res.json({});
    });
});

router.patch('/admin/challenge/:challengeId', function(req, res, next) {
    Challenge.findByIdAndUpdate(req.params.challengeId, {$set: req.body}, function(err) {
        if (err) {
            console.log(err);
            res.json({error: true});
            return;
        }
        res.json({});
    });
});

router.delete('/admin/category/:categoryId', function(req, res, next) {
    Category.findByIdAndRemove(req.params.categoryId, function(err) {
        if (err) {
            console.log(err);
            res.json({error: true});
        } else {
            // remove category from all challenges
            Challenge.update({}, {$pull: {categories: req.params.categoryId}}, {multi: true}, function(err) {
                res.json({});
            });
        }
    });
})

router.delete('/admin/challenge/:challengeId', function(req, res, next) {
    Challenge.findByIdAndRemove(req.params.challengeId, function(err) {
        if (err) {
            console.log(err);
            res.json({error: true});
        } else {
            res.json({});
        }
    });
})

module.exports = router;