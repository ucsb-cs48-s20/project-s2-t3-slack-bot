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
    let userCollection = {
      findOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
    };
    let query2 = {
      lastPraiseTime: 0,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.findOne.mockResolvedValueOnce(query);
    userCollection.findOne.mockResolvedValueOnce(query2);
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
  it("praising someone", async () => {
    let client = {
      collection: jest.fn(),
    };
    let userCollection = {
      findOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
    };
    let query2 = {
      lastPraiseTime: 0,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.findOne.mockResolvedValueOnce(query);
    userCollection.findOne.mockResolvedValueOnce(query2);
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
    expect(res.end).toBeCalledWith("Please wait 10 seconds to praise again!");
  });
});
