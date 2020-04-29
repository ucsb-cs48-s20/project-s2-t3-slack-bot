require("dotenv").config();
//const express = require('express');
//const bodyParser = require('body-parser');
const request = require("request");

export default async function (req, res) {
  console.log("PRINT");
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Hi! :wave: \n I'm your new bot.",
    },
  };
  await request.post("https://slack.com/api/chat.postMessage", data);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: "John Doe" }));
}

/*
export default (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ name: 'John Doe' }))
}
*/
