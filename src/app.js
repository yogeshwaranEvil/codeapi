const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.static("public"));
let username = "";
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Welcome.html");
});
app.get("/api/:username", (req, res) => {
  username = req.params.username;
  axios.get("https://codechef.com/users/" + username).then(function (response) {
    const $ = cheerio.load(response["data"]);
    const newUser = {};
    //getting username,rating,highestrating
    $(".rating-header").each((index, element) => {
      (newUser.username = username),
        (newUser.rating = $(element).find(".rating-number").text()),
        (newUser.highestRating = $(element)
          .find("small")
          .text()
          .replace(/^\D+/g, "")
          .slice(0, -1));
    });
    //getting global and country rank(not that accurate)
    $(".inline-list").each((index, element) => {
      var totalRank = $(element).find("strong").text();
      newUser.globalRank = totalRank.substring(0, totalRank.length / 2);
      newUser.countryRank = totalRank.substring(
        totalRank.length / 2,
        totalRank.length
      );
    });
    //getting total no of questions solved
    $(
      "body > main > div > div > div > div > div > section:nth-child(7) > div > h5:nth-child(1)"
    ).each((idx, el) => {
      newUser.fullySolved = $(el).text().replace(/^\D+/g, "").slice(0, -1);
    });
    //getting total number of contests participated
    $(
      "body > main > div > div > div > div > div > section.rating-graphs.rating-data-section > div.rating-title-container > div > b"
    ).each((idx, el) => {
      newUser.contests = $(el).text();
    });
    //getting div,stars
    $(
      "body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > div.rating-star"
    ).each((idx, el) => {
      newUser.stars = $(el).text();
    });
    $(
      "body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > div:nth-child(2)"
    ).each((idx, el) => {
      newUser.div = $(el).text().slice(1, -1);
    });
    res.status(200).json(newUser);
  });
});
//TODO
const port = process.env.PORT;
app.listen(port, function () {
  console.log("Server started on port", port);
});
