require("dotenv").config();

const request = require("request");

export default async function (req, res) {
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#testing",
      text: "Hi! :wave: \n I'm your new bot.",
    },
  };
  // Sends var data to Slack
  await request.post("https://slack.com/api/chat.postMessage", data);
  // Sends var data to Slack
  res.end("Information of user inserted here");
}
