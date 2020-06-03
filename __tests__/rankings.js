import rankings from "../pages/api/rankings";
import { initDatabase } from "../utils/mongodb";

jest.mock("../utils/mongodb");

describe("/pages/api/rankings", () => {
  it("calling rankings with an empty database", async () => {
    const req = {};

    let res = {
      end: jest.fn(),
    };
    let client = {
      collection: jest.fn(),
    };

    let userCollection = {
      find: jest.fn(),
    };

    let find = {
      sort: jest.fn(),
    };

    let sort = {
      limit: jest.fn(),
    };

    let limit = {
      toArray: jest.fn(),
    };

    let query = [];

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.find.mockReturnValue(find);
    find.sort.mockReturnValue(sort);
    sort.limit.mockReturnValue(limit);
    limit.toArray.mockResolvedValue(query);

    await rankings(req, res);
    expect(res.end).toBeCalledWith("Workspace Leaderboard:\n");
  });

  it("calling rankings less than 3 people", async () => {
    const req = {};

    let res = {
      end: jest.fn(),
    };
    let client = {
      collection: jest.fn(),
    };

    let userCollection = {
      find: jest.fn(),
    };

    let find = {
      sort: jest.fn(),
    };

    let sort = {
      limit: jest.fn(),
    };

    let limit = {
      toArray: jest.fn(),
    };

    let query = [
      { praiseValue: 2, name: "@adarsha" },
      { praiseValue: 0, name: "@kourosh" },
    ];

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.find.mockReturnValue(find);
    find.sort.mockReturnValue(sort);
    sort.limit.mockReturnValue(limit);
    limit.toArray.mockResolvedValue(query);

    await rankings(req, res);
    expect(res.end).toBeCalledWith(
      "Workspace Leaderboard:\nadarsha: 2\nkourosh: 0\n"
    );
  });
  it("calling rankings with exactly 3 people", async () => {
    const req = {};

    let res = {
      end: jest.fn(),
    };
    let client = {
      collection: jest.fn(),
    };

    let userCollection = {
      find: jest.fn(),
    };

    let find = {
      sort: jest.fn(),
    };

    let sort = {
      limit: jest.fn(),
    };

    let limit = {
      toArray: jest.fn(),
    };

    let query = [
      { praiseValue: 12, name: "@fattie" },
      { praiseValue: 2, name: "@adarsha" },
      { praiseValue: 0, name: "@kourosh" },
    ];

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.find.mockReturnValue(find);
    find.sort.mockReturnValue(sort);
    sort.limit.mockReturnValue(limit);
    limit.toArray.mockResolvedValue(query);

    await rankings(req, res);
    expect(res.end).toBeCalledWith(
      "Workspace Leaderboard:\nfattie: 12\nadarsha: 2\nkourosh: 0\n"
    );
  });

  it("calling rankings with more than 3 people", async () => {
    const req = {};

    let res = {
      end: jest.fn(),
    };
    let client = {
      collection: jest.fn(),
    };

    let userCollection = {
      find: jest.fn(),
    };

    let find = {
      sort: jest.fn(),
    };

    let sort = {
      limit: jest.fn(),
    };

    let limit = {
      toArray: jest.fn(),
    };

    let query = [
      { praiseValue: 69, name: "@nice" },
      { praiseValue: 12, name: "@fattie" },
      { praiseValue: 2, name: "@adarsha" },
      { praiseValue: 0, name: "@kourosh" },
    ];

    initDatabase.mockResolvedValue(client);
    client.collection.mockReturnValue(userCollection);
    userCollection.find.mockReturnValue(find);
    find.sort.mockReturnValue(sort);
    sort.limit.mockReturnValue(limit);
    limit.toArray.mockResolvedValue(query);

    await rankings(req, res);
    expect(res.end).toBeCalledWith(
      "Workspace Leaderboard:\nnice: 69\nfattie: 12\nadarsha: 2\nkourosh: 0\n"
    );
  });
});
