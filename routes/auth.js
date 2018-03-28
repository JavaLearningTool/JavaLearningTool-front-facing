const express = require("express");
const router = express.Router();
const request = require("request");

const logger = require("../logger.js");

router.get("/login/:redirect?", function(req, res, next) {
    console.log(req.params.redirect);
});

module.exports = router;
