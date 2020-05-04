require("dotenv").config();

const request = require("request");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/", (req, res) => {
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Hi! :wave: \n I'm your new bot.",
    },
  };
  request.post("https://slack.com/api/chat.postMessage", data, function (
    error,
    response,
    body
  ) {
    // Sends welcome message
    res.json();
  });
});
