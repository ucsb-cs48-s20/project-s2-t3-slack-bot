require("dotenv").config();
const request = require("request");
const { WebClient } = require("@slack/web-api");

// Read a token from the environment variables
const token = process.env.SLACK_AUTH_TOKEN;

// Initialize a web client
const web = new WebClient(token);

// Declare global variable for user input
var userInput;

export default async function (req, res) {
  // Assign userInput with the user input
  userInput = req.body.text;

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

// Usage: /schedule create [month] [day] [year] [hour] [minute] [AM/PM] [message]
// e.g.   /schedule create 5 19 2020 3 20 pm @channel class starting in 10 minutes
// "mDYHMAM" whereever it appears in the code stands for "month", "day", "year", "hour", "minute", "am/pm", and "message"
async function scheduleCreate(req, res, userInput) {
  /*
  // Get list of users for whenever the message contains an @
  const userList = await web.users.list({
    token: process.env.SLACK_AUTH_TOKEN,
  });
  
  console.log(userList);
  */

  // Hard-coded strings for printing in error messages
  var mDYHMAMStringArray = [
    "month",
    "day",
    "year",
    "hour",
    "minute",
    "am/pm",
    "message",
  ];

  // Check to see if they didn't enter anything past the word "create"
  if (userInput.indexOf(" ") == -1) {
    res.end(
      "You can create a reminder using this syntax: `/schedule create [month] [day] [year] [hour] [minute] [AM/PM] [message]`. Type `/schedule help` for more info."
    );
  }

  // Get the user input past the text "/schedule create "
  var timeAndMessageString = userInput.substring(userInput.indexOf(" ") + 1);

  // Go through user input and fill the array in
  // The order of elements in the array are: month, day, year, hour, minute, am/pm, message
  var mDYHMAMUserInputArray = [];
  for (var i = 0; i < 6; i++) {
    // If they didn't input enough parameters
    if (timeAndMessageString.indexOf(" ") == -1) {
      res.end(
        "You did not enter enough parameters. You entered `/schedule " +
          userInput +
          "`.\nYou can create a reminder using this syntax: `/schedule create [month] [day] [year] [hour] [minute] [AM/PM] [message]`. Type `/schedule help` for more info."
      );
    }

    // Find the next string that is split by a space and push it to mDYHMAMUserInputArray
    mDYHMAMUserInputArray.push(
      timeAndMessageString.substring(0, timeAndMessageString.indexOf(" "))
    );
    timeAndMessageString = timeAndMessageString.substring(
      timeAndMessageString.indexOf(" ") + 1
    );
  }

  // Push timeAndMessageString into user input array, which the string should now just be the message
  mDYHMAMUserInputArray.push(timeAndMessageString);

  // Validate the six time variables
  for (var j = 0; j < 6; j++) {
    // Check to see if the month/day/year/hour/minute value is a number
    if (j < 5 && isNaN(mDYHMAMUserInputArray[j])) {
      res.end(
        "Your input for `" +
          mDYHMAMStringArray[j] +
          "` was not a number. You entered `/schedule " +
          userInput +
          "`. Please try again."
      );
    }

    // Check to see if the values are within their respective ranges (e.g. the month value is between 1 and 12)
    var potentialErrorMessage = validateUserInputParameter(
      mDYHMAMUserInputArray[j],
      mDYHMAMStringArray,
      mDYHMAMStringArray[j]
    );
    if (potentialErrorMessage != "Valid value") {
      res.end(potentialErrorMessage);
    }
  }

  // Reformatting of @channel/@here/@userThatCreatedTheReminder
  mDYHMAMUserInputArray[6] = mDYHMAMUserInputArray[6].replace(
    /@channel/g,
    "<!channel>"
  );
  mDYHMAMUserInputArray[6] = mDYHMAMUserInputArray[6].replace(
    /@here/g,
    "<!here>"
  );
  mDYHMAMUserInputArray[6] = mDYHMAMUserInputArray[6]
    .split("@" + req.body.user_name)
    .join("<@" + req.body.user_id + ">");

  // Create date object using mDYHMAMUserInputArray parameters
  var dateInFuture = new Date();
  dateInFuture.setFullYear(
    mDYHMAMUserInputArray[2],
    mDYHMAMUserInputArray[0] - 1,
    mDYHMAMUserInputArray[1]
  );
  if (mDYHMAMUserInputArray[5].toLowerCase() == "pm") {
    dateInFuture.setHours(
      parseInt(mDYHMAMUserInputArray[3]) + 12,
      mDYHMAMUserInputArray[4],
      0,
      0
    );
  } else {
    dateInFuture.setHours(
      mDYHMAMUserInputArray[3],
      mDYHMAMUserInputArray[4],
      0,
      0
    );
  }

  try {
    // Create the scheduled message that gets posted at dateInFuture's time
    const result = await web.chat.scheduleMessage({
      token: process.env.SLACK_AUTH_TOKEN,
      channel: req.body.channel_id,
      // prettier-ignore
      text: mDYHMAMUserInputArray[6],
      post_at: dateInFuture.getTime() / 1000,
    });

    // Send message (visible only to person who scheduled) that the scheduled reminder was successfully created
    res.end(
      "Successfully scheduled reminder `" +
        mDYHMAMUserInputArray[6] +
        "` for `" +
        dateInFuture.toLocaleString() +
        "`."
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
    ">• `/schedule create [month] [day] [year] [hour] [minute] [AM/PM] [message]`\n";
  helpString +=
    ">     *Creates a new reminder using the parameters given.* Reminders cannot be set more than 120 days in advance, or be set for the past.\n";
  helpString +=
    ">     At the moment, the only @mentions available are <!channel>, <!here>, and *@[the person who created the reminder]*.\n";
  helpString +=
    ">         *Example:* /schedule create 5 21 2020 4 50 pm Class is starting in 10 minutes! <!channel> Today is demo day!\n\n";
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

function validateUserInputParameter(
  userInputForParameter,
  mDYHMAMStringArray,
  mDYHMAMStringArrayValue
) {
  switch (mDYHMAMStringArrayValue) {
    case mDYHMAMStringArray[0]: // Month: Check to see if the month value is between 1 and 12
      if (userInputForParameter < 1 || userInputForParameter > 12) {
        return (
          "Your input for `month` was out of range. You entered `/schedule " +
          userInput +
          "`. Please enter a `month` between 1 and 12."
        );
      }
      return "Valid value";
    case mDYHMAMStringArray[1]: // Day: Check to see if the day value is between 1 and 31
      if (userInputForParameter < 1 || userInputForParameter > 31) {
        return (
          "Your input for `day` was out of range. You entered `/schedule " +
          userInput +
          "`. Please enter a `day` between 1 and 31."
        );
      }
      return "Valid value";
    case mDYHMAMStringArray[2]: // Year: Actually we don't need to check the year (as long as it's a number, which it is if we made it to this line of the code)
      return "Valid value";
    case mDYHMAMStringArray[3]: // Hour: Check to see if the hour value is between 1 and 12
      if (userInputForParameter < 1 || userInputForParameter > 12) {
        return (
          "Your input for `hour` was out of range. You entered `/schedule " +
          userInput +
          "`. Please enter an `hour` between 1 and 12."
        );
      }
      return "Valid value";
    case mDYHMAMStringArray[4]: // Minute: Check to see if the minute value is between 00 and 59
      if (userInputForParameter < 0 || userInputForParameter > 59) {
        return (
          "Your input for `minute` was out of range. You entered `/schedule " +
          userInput +
          "`. Please enter a `minute` between 1 and 59."
        );
      }
      return "Valid value";
    case mDYHMAMStringArray[5]: // AM/PM: Check to see if they put either am or pm (case insensitive)
      if (
        userInputForParameter.toLowerCase() != "am" &&
        userInputForParameter.toLowerCase() != "pm"
      ) {
        return (
          "Your input for `AM/PM` was invalid. You entered `/schedule " +
          userInput +
          "`. Please enter either `AM` or `PM`."
        );
      }
      return "Valid value";
    default:
      res.end(
        "If you are seeing this message, then the developers of this bot made a bug here! Error (1)"
      );
  }
}
