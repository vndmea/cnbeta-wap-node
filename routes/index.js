var express = require("express");
var router = express.Router();
var request = require("request-promise");
var cheerio = require("cheerio");

// 全站入口，不带分页参数
router.get("/", function (req, res) {
  var page = req.query.page;
  if (page) {
    // 第1页和第0页同时获取
    page = parseInt(page) > 1 ? parseInt(page) : 0;
  }

  request("https://m.cnbeta.com/wap" + (page ? "/index.htm?page=" + page : ""))
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

// 分页参数
router.get("/:param", function handler(_, res) {
  return res.json({ message: "error", data: null, success: false });
});

module.exports = router;
