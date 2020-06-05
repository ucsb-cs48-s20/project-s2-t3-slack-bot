import appraise from "../pages/api/appraise";
import { initDatabase } from "../utils/mongodb";

jest.mock("../utils/mongodb");

describe("/pages/api/appraise", () => {
  it("Should appraise without text input", async () => {
    const req = {
      body: {
        text: "",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await appraise(req, res);
    expect(res.end).toBeCalledWith("Please tag the person you want to view :)");
  });
  it("Should trigger cooldown timer", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    let query2 = {
      lastApraiseTime: Math.floor(Date.now() / 1000),
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValue(query2);

    const req = {
      body: {
        text: "@alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await appraise(req, res);
    expect(res.end).toBeCalledWith("Wait 6 seconds to appraise again");
  });
  it("Should appraise existing user", async () => {
    let client = {
      collection: jest.fn(),
    };
    let usersCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
      lastApraiseTime: 0,
    };
    // let query2 = {
    //   praiseValue: 10,
    // }

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(usersCollection);
    usersCollection.findOne.mockResolvedValue(query);
    // userCollection.findOne.mockResolvedValue(query2);

    const req = {
      body: {
        text: "@alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await appraise(req, res);
    expect(res.end).toBeCalledWith("alanzhang052 has 10 rep!");
  });
});
