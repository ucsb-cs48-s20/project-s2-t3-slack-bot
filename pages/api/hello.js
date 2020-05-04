require("dotenv").config();

const request = require("request");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/", (req, res) => {
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#testing",
      text: "/hello has been called!",
    },
  };
  request.post("https://slack.com/api/chat.postMessage", data, function (
    error,
    response,
    body
  ) {
    // Sends var data to Slack
    res.json();
  });
  // Sends private message to user that called command
  res.end("A hello has been sent to the testing channel! Check it out!");
});
