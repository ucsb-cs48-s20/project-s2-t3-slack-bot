require("dotenv").config();
const request = require("request");

export default async function (req, res) {
  console.log("PRINT");
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Hello!",
    },
  };
  await request.post("https://slack.com/api/chat.postMessage", data);
}
