const express = require('express');
const router = express.Router();
const request = require('request');

const Challenge = require('../models/challenge.js');
const Category = require('../models/challenge_category.js');

const errorMessage = "Compilation failed. Try again later.";

/* GET home page. */

router.post('/compile', function (req, res, next) {
  console.log("SRC Code: " + req.body.code);

  // res.json([
  //   { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n" },
  //   { passed: "false", expected: "Hello W\\n", actual: "Hello World\\n" },
  //   { passed: "true", expected: "Hello World\\n", actual: "Hello World\\n" }
  // ]);

  // return;

  request.post({url: 'http://localhost:8080', method: "POST", form: {src: req.body.code, challenge: req.body.challenge}}, function (error, response, body) {
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

  categories = [];
  challenge = {};
  let callbackCount = 0;

  let callback = function(err) {
    callbackCount++;
    if (callbackCount < 2) {
      return;
    }
    res.render("challenge", { 
      challenge,
      categories,
      title: challenge.name,
      codeBox: true,
      scripts: [
        'codemirror',
        'clike',
        'testResultsBundle'
      ]
    });
  }

  Category.find({}, function(err, cats) {
    if (err) {
      console.log(err);
      res.json({error: errorMessage});      
    } else {
      categories = cats;
      callback();
    }
  });

  Challenge.findOne({testFile: req.params.path}, function(err, chall) {
    
    if (err) {
      console.log(err);
      res.json({error: errorMessage});    
      return;        
    }

    if (challenge === null) {
      next();
      return;
    }
    
    challenge = chall;
    callback();

  })
});

module.exports = router;
