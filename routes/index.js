var express = require('express');
var router = express.Router();
var request = require("request-promise");
var cheerio = require("cheerio");

router.get("/", function (_, res) {
  console.log("index route");
  request("https://m.cnbeta.com/wap")
    .then(function (htmlString) {
      var $ = cheerio.load(htmlString);
      var data = $("div.list a")
        .map(function () {
          return {
            aid: $(this).attr("href").substr(10, 7),
            text: $(this).text(),
          };
        })
        .get();
      return res.json({ message: "", data, success: true });
    })
    .catch(function () {
      return res.json({ message: "error", data: null, success: false });
    });
});

module.exports = router;
