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
      scheduleHelp(req, res, userInput);
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
  let numOfSecondsInTheFuture = 1200; // Minimum time is 5-10(?) seconds (unsure why this is the case)
  var dateInFuture = new Date(date.getTime());
  dateInFuture.setSeconds(dateInFuture.getSeconds() + numOfSecondsInTheFuture);

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
}

// Usage: /schedule list
async function scheduleList(req, res, userInput) {
  try {
    // Retrieve list of reminders
    const result = await web.chat.scheduledMessages.list({
      token: process.env.SLACK_AUTH_TOKEN,
      //channel: req.body.channel_id, // This parameter can be used to specify what channel to only retrieve reminders from
    });

    // Declare a string variable to write all scheduled reminders to
    var scheduledRemindersList = "*Here is the list of scheduled reminders:*\n";

    // Traverse list of scheduled reminders and append them to the string (scheduledRemindersList)
    for (var i = 0; i < result.scheduled_messages.length; i++) {
      // Why is result.scheduled_messages in random order ???
      scheduledRemindersList += formScheduledRemindersListElement(
        result.scheduled_messages[i],
        i
      );
    }

    // Send list (visible only to person who scheduled) to user
    res.end(scheduledRemindersList);
  } catch (error) {
    // Send message (visible only to person who typed the command) that the command failed
    console.error(error);
    res.end("Error retrieving list of scheduled reminders.");
  }
}

// Usage: /schedule delete [reminder number], where [reminder number] is retrieved from /schedule list
async function scheduleDelete(req, res, userInput) {
  // Check to see if they didn't enter anything past the word "delete"
  if (userInput.indexOf(" ") == -1) {
    res.end(
      "Please enter the number of the reminder from `/schedule list` you would like to delete. Example: `/schedule delete 3`"
    );
  }

  // Get the user input past the text "/schedule delete "
  var inputReminderNumber = userInput.substring(userInput.indexOf(" ") + 1);

  // Check if the user input is NOT a number
  if (isNaN(inputReminderNumber)) {
    // Tell the user that their input is not valid
    res.end(
      "`" + inputReminderNumber + "` is not a valid number. Please try again."
    );
  }

  // Retrieve list of reminders
  const result = await web.chat.scheduledMessages.list({
    token: process.env.SLACK_AUTH_TOKEN,
    //channel: req.body.channel_id, // This parameter can be used to specify what channel to only retrieve reminders from
  });

  // Check if the number they inputted is within the number of reminders
  var numOfReminders = result.scheduled_messages.length;
  if (inputReminderNumber < 1 || inputReminderNumber > numOfReminders) {
    // Tell the user that their input is not valid
    res.end(
      "Reminder #" +
        inputReminderNumber +
        " is not a valid reminder. Type `/schedule list` for the list of reminders and try again."
    );
  }

  // Now finally delete the reminder
  try {
    var reminderToBeDeleted =
      result.scheduled_messages[inputReminderNumber - 1];
    const deleteReminderResult = await web.chat.deleteScheduledMessage({
      token: process.env.SLACK_AUTH_TOKEN,
      channel: reminderToBeDeleted.channel_id,
      scheduled_message_id: reminderToBeDeleted.id,
    });

    // Tell the user that the delete was successful
    var reminderDate = new Date(reminderToBeDeleted.post_at * 1000);
    var reminderToBeDeletedTimeAsString = reminderDate.toLocaleString();
    res.end(
      "The reminder `" +
        reminderToBeDeleted.text +
        "` scheduled for `" +
        reminderToBeDeletedTimeAsString +
        "` was successfully deleted.*"
    );
  } catch (error) {
    // Send error message to user
    res.end(
      "Error deleting reminder. Perhaps you tried to delete a reminder that is about to be sent?"
    );
  }
}

// Usage: /schedule help (or simply just /schedule)
async function scheduleHelp(req, res, userInput) {
  // Declare a variable to be built upon to display the help message
  var helpString = "";

  // Build the help message
  helpString += "*Here is the list of *`/schedule` *commands:*\n";
  helpString +=
    ">• `/schedule create [month] [day] [year] [hour] [minute] [am/pm] [message]`\n";
  helpString +=
    ">     *Creates a new reminder using the parameters given.* Note that reminders cannot be set more than 120 days in advance, or be set for the past.\n";
  helpString +=
    ">         *Example:* /schedule create 5 21 2020 4 50 pm <!channel> Class is starting in 10 minutes!\n\n";
  helpString += ">• `/schedule list`\n";
  helpString += ">     *Shows a list of all existing reminders.*\n\n";
  helpString += ">• `/schedule delete [reminder number]`\n";
  helpString +=
    ">     *Deletes a reminder using the numbers from* `/schedule list`. Note that you cannot delete a reminder that will be posted within 60 seconds of the delete request.\n";
  helpString += ">         *Example:* /schedule delete 2\n\n";
  helpString += ">• `/schedule help`\n";
  helpString += ">     *Displays this list of commands.*\n";

  // Display the message to the user
  res.end(helpString);
}

function formScheduledRemindersListElement(scheduledMessageJSON, elementIndex) {
  var reminderDate = new Date(scheduledMessageJSON.post_at * 1000);
  var timeToPostAsString = reminderDate.toLocaleString();
  var channelToPostIn = scheduledMessageJSON.channel_id;
  var scheduledMessage = scheduledMessageJSON.text;
  // prettier-ignore
  return ">" + (elementIndex + 1) + ". [" + timeToPostAsString + " for <#" + channelToPostIn + ">]: " + scheduledMessage + "\n"
}
