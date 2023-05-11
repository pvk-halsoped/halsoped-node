const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// create application/json parser
var jsonParser = bodyParser.json();

const httpPort = 80;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/upload", jsonParser, function (req, res) {
  const listOfLists = req.body;
  res.status(200).end();
  listOfLists.forEach((element) => {
    console.log(element);
  });
});

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`);
});
