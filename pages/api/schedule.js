require("dotenv").config();
const request = require("request");
const { WebClient } = require("@slack/web-api");

// Read a token from the environment variables
const token = process.env.SLACK_AUTH_TOKEN;

// Initialize a web client
const web = new WebClient(token);

export default async function (req, res) {
  // Get the user input as a string
  var userInput = req.body.text;
  console.log("userInput: " + userInput);

  // Get the first word of their input
  var scheduleCommand;
  if (userInput.indexOf(" ") != -1) {
    scheduleCommand = userInput.substring(0, userInput.indexOf(" "));
  } else {
    scheduleCommand = userInput;
  }

  // Go to different functions depending on user input of the first word
  switch (scheduleCommand) {
    case "create":
      scheduleCreate(req, res, userInput);
      break;
    case "list":
      scheduleList(req, res, userInput);
      break;
    case "delete":
      scheduleDelete(req, res, userInput);
      break;
    case "":
    case "help":
      res.end("help message goes here. (You said " + scheduleCommand + ").");
      break;
    default:
      res.end(
        "Invalid command. You typed `/schedule " +
          scheduleCommand +
          "`. Please type `/schedule help` for a list of `/schedule` commands."
      );
  }
}

// Usage: /schedule create [month] [day] [year] [hour] [minute] [am/pm] [message]
// e.g.   /schedule create 5 19 2020 3 20 pm @channel class starting in 10 minutes
async function scheduleCreate(req, res, userInput) {
  // Create a date object to manipulate time
  let date = new Date();

  // Create a date in the future based on numOfSecondsInTheFuture (this should be user input somehow)
  let numOfSecondsInTheFuture = 20; // Minimum time is 5-10(?) seconds (unsure why this is the case)
  var dateInFuture = new Date(date.getTime());
  dateInFuture.setSeconds(dateInFuture.getSeconds() + numOfSecondsInTheFuture);

  // Print dates into console for debugging
  console.log("date's time: " + date.toLocaleString());
  console.log("dateInFuture's time: " + dateInFuture.toLocaleString());

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
        ". You can only schedule a reminder 120 days in advance and cannot schedule a reminder for the past."
    );
    console.error(error);
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

async function scheduleList(req, res, userInput) {
  try {
    // Retrieve list of reminders
    const result = await web.chat.scheduledMessages.list({
      token: process.env.SLACK_AUTH_TOKEN,
      //channel: req.body.channel_id,
    });

    // Declare a string variable to write all scheduled reminders to
    var scheduledRemindersList = "*Here is the list of scheduled reminders:*\n";

    // Traverse list of scheduled reminders and append them to the string (scheduledRemindersList)
    for (var i = 0; i < result.scheduled_messages.length; i++) {
      var reminderDate = new Date(result.scheduled_messages[i].post_at * 1000);
      var timeToPostAsString = reminderDate.toLocaleString();
      var channelToPostIn = result.scheduled_messages[i].channel_id;
      var scheduledMessage = result.scheduled_messages[i].text;
      scheduledRemindersList +=
        ">" +
        (i + 1) +
        ". [" +
        timeToPostAsString +
        " for <#" +
        channelToPostIn +
        ">]: " +
        scheduledMessage +
        "\n";
    }

    // Send list (visible only to person who scheduled) to user
    res.end(scheduledRemindersList);
  } catch (error) {
    // Send message (visible only to person who typed the command) that the command failed
    console.error(error);
    res.end("Error retrieving list of scheduled reminders.");
  }
}

function scheduleDelete(req, res) {}

function scheduleHelp(req, res) {}
