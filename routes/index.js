const express = require('express');
const router = express.Router();
const request = require('request');

const Challenge = require('../models/challenge.js');

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
      return;
    }
    console.log(body);
    res.json(JSON.parse(body));
  });
});
 
router.get('/', function(req, res, next) {

  Challenge.findOne({}, function(err, challenge) {
    console.log(challenge.testFile);
    res.render("index", { 
      challenge,
      title: challenge.name,
      codeBox: true,
      scripts: [
        'codemirror',
        'clike',
        'testResultsBundle'
      ]
    });
  });
});

module.exports = router;
