//callback(?) for bot invitation

require("dotenv").config();

// Import express and request modules
//const express = require("express");
const request = require("request");

// Instantiates Express and assigns our app variable to it
//var app = express();

export default async function (req, res) {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Looks like we're not getting code." });
    console.log("Looks like we're not getting code.");
  } else {
    // If it's there...

    var options = {
      uri:
        "https://slack.com/api/oauth.v2.access?code=" +
        req.query.code +
        "&client_id=" +
        process.env.SLACK_CLIENT_ID +
        "&client_secret=" +
        process.env.SLACK_CLIENT_SECRET +
        "&redirect_uri=" +
        process.env.SLACK_REDIRECT_URI,
      method: "GET",
    };

    request(options, (error, response, body) => {
      var JSONresponse = JSON.parse(body);
      if (!JSONresponse.ok) {
        console.log(JSONresponse);
        res
          .send("Error encountered: \n" + JSON.stringify(JSONresponse))
          .status(200)
          .end();
      } else {
        console.log(JSONresponse);
        res.send("Success!");
      }
    });
  }
}
