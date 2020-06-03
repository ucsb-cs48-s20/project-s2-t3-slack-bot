import hello from "../pages/api/hello";

describe("/pages/api/hello", () => {
  it("Replies with a greeting message back", () => {
    const req = {};
    let res = {
      end: jest.fn(),
    };
    hello(req, res);
    expect(res.end).toBeCalledWith("Hello!");
  });
});
