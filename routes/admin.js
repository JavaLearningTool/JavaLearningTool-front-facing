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
                scripts: []
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

router.put('/admin/category/', function(req, res, next) {
    let newCat = Category({
        title: req.body.category
    });

    newCat.save(function(err) {
        if (err) console.log(err);
        res.redirect('/admin');
    });
});

module.exports = router;