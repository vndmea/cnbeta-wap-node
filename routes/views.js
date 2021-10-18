var express = require("express");
var router = express.Router();
var request = require("request-promise");
var cheerio = require("cheerio");

router.get("/*", function (req, res, next) {
  console.log("wap route");
  console.log(req.url);
  request("https://m.cnbeta.com" + req.url)
    .then(function (htmlString) {
      var $ = cheerio.load(htmlString);

      // css
      $("link").each(function () {
        var href = $(this).attr("href");
        if (href.startsWith("/css")) {
          $(this).attr("href", "https://m.cnbeta.com" + href);
        }
      });

      // 图片
      $("img").each(function () {
        var src = $(this)
          .data("cfsrc")
          .replace("https://static.cnbetacdn.com", "/cdn");
        $(this).attr("src", src).removeAttr("style").removeAttr("data-cfsrc");
      });

      // 去除广告
      $(
        `.adsbygoogle, .article-global, 
        .cnbeta-article-latest, .back, 
        .infinity, iframe, ins, noscript, 
        script, .footer,
        #header, #commentHolder, #go_nav`
      ).remove();
      return res.send($.html());
    })
    .catch(function () {
      return res.json({ message: "error", data: null, success: false });
    });
});

module.exports = router;
