require("dotenv").config();

const request = require("request");

export default async function (req, res) {
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#testing",
      text: "This is the command /appraise!",
    },
  };
  await request.post("https://slack.com/api/chat.postMessage", data);
  console.log(data);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: "John Doe" }));
}
