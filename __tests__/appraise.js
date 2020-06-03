import appraise from "../pages/api/appraise";
import { initDatabase } from "../utils/mongodb";

jest.mock("../utils/mongodb");

describe("/pages/api/appraise", () => {
  it("Appraising without text input", async () => {
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
  it("Appraising existing user", async () => {
    let client = {
      collection: jest.fn(),
    };
    let userCollection = {
      findOne: jest.fn(),
    };
    let query = {
      praiseValue: 10,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.findOne.mockResolvedValue(query);

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
  it("Appraising existing user", async () => {
    let client = {
      collection: jest.fn(),
    };
    let userCollection = {
      findOne: jest.fn(),
    };
    let query = {
      praiseValue: 0,
    };

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.findOne.mockResolvedValue(query);

    const req = {
      body: {
        text: "@alanzhang052",
      },
    };

    let res = {
      end: jest.fn(),
    };

    await appraise(req, res);
    expect(res.end).toBeCalledWith("alanzhang052 has no rep. :(");
  });
});
