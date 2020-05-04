const request = require("request");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/", (req, res) => {
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#testing",
      text: "/hello is back online!",
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
