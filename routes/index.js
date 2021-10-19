var express = require('express');
var router = express.Router();
var request = require("request-promise");
var cheerio = require("cheerio");

// 当路径中传入数字用于分页
function handler(req, res) {
  var page = req.params.page;
  if (page) {
    if (isNaN(parseInt(page))) {
      return res.json({ message: "error", data: null, success: false });
    }

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
}

// 全站入口，不带分页参数
router.get("/", handler);

// 分页参数
router.get("/:page", handler);

module.exports = router;
