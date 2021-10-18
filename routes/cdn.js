var express = require("express");
var router = express.Router();
var request = require("request-promise");
var cheerio = require("cheerio");

router.get("/*", function (req, res, next) {
  request({
    url: "https://static.cnbetacdn.com" + req.url,
    referer: "https://m.cnbeta.com/",
  }).pipe(res);
});

module.exports = router;
