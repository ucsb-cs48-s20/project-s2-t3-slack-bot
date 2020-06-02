import schedule from "../pages/api/schedule";
const { WebClient } = require("@slack/web-api");

// need to MOCK THE MODULE HERE
jest.mock("@slack/web-api");

function helpString() {
  var helpString = "";

  // Build the help message
  helpString += "*Here is the list of *`/schedule` *commands:*\n";
  helpString +=
    ">• `/schedule add [month] [day] [year] [hour] [minute] [AM/PM] [message]`\n";
  helpString +=
    ">     *Adds a new reminder using the parameters given.* Reminders cannot be set more than 120 days in advance, or be set for the past.\n";
  helpString +=
    ">     At the moment, the only @mentions available are <!channel>, <!here>, and *@[the person who added the reminder]*.\n";
  helpString +=
    ">         *Example:* /schedule add 5 21 2020 4 50 pm Class is starting in 10 minutes! <!channel> Today is demo day!\n\n";
  helpString += ">• `/schedule list`\n";
  helpString += ">     *Shows a list of all existing reminders.*\n\n";
  helpString += ">• `/schedule remove [reminder number]`\n";
  helpString +=
    ">     *Removes a reminder using the numbers from* `/schedule list`. Note that you cannot remove a reminder that will be posted within 60 seconds of the remove request.\n";
  helpString += ">         *Example:* /schedule remove 2\n\n";
  helpString += ">• `/schedule help`\n";
  helpString += ">     *Displays this list of commands.*\n";
  return helpString;
}

describe("/pages/api/schedule", () => {
  it("Calls schedule with empty message", () => {
    const req = {
      body: {
        text: "",
      },
    };
    let res = {
      end: jest.fn(),
    };

    schedule(req, res);

    expect(res.end).toBeCalledWith(helpString());
  });
  it("Calls schedule with a help message", () => {
    const req = {
      body: {
        text: " help",
      },
    };
    let res = {
      end: jest.fn(),
    };

    schedule(req, res);

    expect(res.end).toBeCalledWith(helpString());
  });

  it("Calls schedule with improper string", () => {
    const req = {
      body: {
        text: "she sells sea shells by the sea shore",
      },
    };
    let res = {
      end: jest.fn(),
    };

    schedule(req, res);

    expect(res.end).toBeCalledWith(
      "Invalid command. You typed `/schedule " +
        "she" +
        "`. Please type `/schedule help` for a list of `/schedule` commands."
    );
  });

  it("Calls schedule with list", () => {
    const req = {
      body: {
        text: "list",
      },
    };

    let res = {
      end: jest.fn(),
    };
    let testHelper;
    let list = jest.fn();
    let scheduledMessages = { list };
    let chat = { scheduledMessages };
    let web = { chat };

    let result = {
      scheduled_messages: [
        {
          id: 1,
          channel_id: 1,
          post_at: 1000,
          date_created: 1,
          text: "testing",
        },
      ],
    };

    //    WebClient.mockReturnValue(web)

    //  list.mockResolvedValue(result);
    testHelper.mockReturnValue(result);

    schedule(req, res);
    expect(res.end).toBeCalledWith("empty");
  });

  it("Calls add with not enough parameters", () => {
    const req = {
      body: {
        text: "add",
      },
    };

    let res = {
      end: jest.fn(),
    };

    schedule(req, res);
    expect(res.end).toBeCalledWith(
      "You did not enter enough parameters. You entered `/schedule add`.\nYou can add a reminder using this syntax: `/schedule add [month] [day] [year] [hour] [minute] [AM/PM] [message]`. Type `/schedule help` for more info."
    );
  });
});
