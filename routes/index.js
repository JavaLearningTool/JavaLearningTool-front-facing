var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */

router.post('/compile', function (req, res, next) {
  request.post({url: 'http://localhost:8080', method: "POST", form: {src: req.body.code}}, function (error, response, body) {
    if (error) {
      console.log(error);
      return;
    }
    console.log(body);
    res.send('<pre>' + body + '</pre>');
  });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
