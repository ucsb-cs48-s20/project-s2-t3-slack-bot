require("dotenv").config();
const request = require("request");
const { WebClient } = require("@slack/web-api");

// Read a token from the environment variables
const token = process.env.SLACK_AUTH_TOKEN;

// Initialize
const web = new WebClient(token);

export default async function (req, res) {
  // Get the user input as a string
  var userInput = req.body.text;

  // Create a date object to manipulate time
  let date = new Date();
  console.log(date.toLocaleString());

  // Create a date in the future based on numOfSecondsInTheFuture (this should be user input somehow)
  let numOfSecondsInTheFuture = 10; // Minimum time is 5-10 (?) seconds (unsure why this is the case)
  var dateInFuture = date; // JavaScript does a shallow copy :/
  dateInFuture.setSeconds(dateInFuture.getSeconds() + numOfSecondsInTheFuture);

  console.log(dateInFuture.toLocaleString());

  try {
    // Create the scheduled message that gets posted numOfSecondsInTheFuture seconds into the future
    const result = await web.chat.scheduleMessage({
      token: process.env.SLACK_AUTH_TOKEN,
      channel: req.body.channel_id,
      text:
        "Hello <@" +
        req.body.user_id +
        ">! Here is a message you scheduled to send at " +
        dateInFuture.toLocaleString() +
        ".",
      post_at: dateInFuture.getTime() / 1000,
    });

    // Send message (visible only to person who scheduled) that the scheduled reminder was successfully created
    res.end(
      "Scheduled reminder for " +
        dateInFuture.toLocaleString() +
        " successfully created."
    );
  } catch (error) {
    // Send message (visible only to person who scheduled) that the scheduled reminder was NOT successfully created
    res.end(
      "Error creating scheduled reminder at date " +
        dateInFuture.toLocaleString() +
        "."
    );
    console.log(error);
  }

  /* Trying to trigger the bot to call the command again
  const result2 = await web.chat.scheduleMessage({
    token: process.env.SLACK_AUTH_TOKEN,
    channel: req.body.channel_id,
    text: '/schedule',
    post_at: date.getTime()/1000 + 5 // This is in seconds
  });
  */
}
