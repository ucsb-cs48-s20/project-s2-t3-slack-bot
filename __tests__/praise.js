import praise from "../pages/api/praise";
import { initDatabase } from "../utils/mongodb";
import getTimeStamp from "../utils/getTimeStamp";

jest.mock("../utils/mongodb");
jest.mock("../utils/getTimeStamp");

describe("/pages/api/praise", () => {
  it("Appraising without text input", async () => {
    const req = {
      body: {
        text: "",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await praise(req, res);
    expect(res.end).toBeCalledWith(
      "Please tag the person you want to praise :)"
    );
  });
  it("Appraising self", async () => {
    const req = {
      body: {
        text: "@alanzhang052",
        user_name: "alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await praise(req, res);
    expect(res.end).toBeCalledWith("You cannot praise yourself, silly!");
  });
  it("Cooldown Timer", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
    };
    let query2 = {
      lastPraiseTime: 0,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValueOnce(query);
    usersCollection.findOne.mockResolvedValueOnce(query2);
    getTimeStamp.mockReturnValue(10);

    const req = {
      body: {
        text: "@kouroshsafari",
        user_name: "alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await praise(req, res);
    expect(res.end).toBeCalledWith("Please wait 10 seconds to praise again!");
  });
  it("User doesn't exist in database", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
    };
    let query2 = false;
    let newUser = {
      name: "alanzhang052",
      praiseValue: 1,
      lastPraiseTime: 20,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValueOnce(query);
    usersCollection.findOne.mockResolvedValueOnce(query2);
    getTimeStamp.mockReturnValue(20);
    // usersCollection.insertOne.mockResolvedValue(newUser);

    const req = {
      body: {
        text: "@kouroshsafari",
        user_name: "alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await praise(req, res);
    expect(res.end).toBeCalledWith(
      "You have been added to the workspace reputation system!\n Please try appraising again in 20 seconds."
    );
  });
  it("Praising someone", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
    };
    let query2 = {
      lastPraiseTime: 0,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValueOnce(query);
    usersCollection.findOne.mockResolvedValueOnce(query2);
    getTimeStamp.mockReturnValue(20);

    const req = {
      body: {
        text: "@kouroshsafari",
        user_name: "alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await praise(req, res);
    expect(res.end).toBeCalledWith("kouroshsafari has been praised.");
  });
});
