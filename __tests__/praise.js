import praise from "../pages/api/praise";
import { initDatabase } from "../utils/mongodb";
import getTimeStamp from "../utils/getTimeStamp";

jest.mock("../utils/mongodb");
jest.mock("../utils/getTimeStamp");

describe("/pages/api/praise", () => {
  it("Asks who you want to praise if you didn't add text", async () => {
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
    expect(res.end).toBeCalledWith("You cannot praise yourself, silly.");
  });
  it("Should keep someone from praising again within 20 seconds", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    var tempTimeStamp = Math.floor(Date.now() / 1000);
    let praisee = {
      praiseValue: 10,
    };
    let praiser = {
      lastPraiseTime: tempTimeStamp,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValueOnce(praisee);
    usersCollection.findOne.mockResolvedValueOnce(praiser);

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
    expect(res.end).toBeCalledWith("Wait 20 seconds to praise again");
  });
  it("Should add user if they don't exist in database", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
    };
    let praisee = {
      praiseValue: 10,
    };
    let praiser = false;
    let newUser = {
      name: "alanzhang052",
      praiseValue: 1,
      lastPraiseTime: 20,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValueOnce(praisee);
    usersCollection.findOne.mockResolvedValueOnce(praiser);
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
      "You have been added to the workspace reputation system!\n Please try praising again in 20 seconds."
    );
  });
  it("Should praise someone", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    let praisee = {
      praiseValue: 10,
    };
    let praiser = {
      lastPraiseTime: 0,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValueOnce(praisee);
    usersCollection.findOne.mockResolvedValueOnce(praiser);
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
