const { login } = require("./users");
jest.mock("../servises/users");
const { findByEmail, updateUser } = require("../servises/users");
jest.mock("../utils/password");
const { comparePassword } = require("../utils/password");
process.env.TOKEN_SECRET = "test";

class MockHttpResponse {
  statusInfo;
  ended = false;
  jsonData = null;

  status(status) {
    this.statusInfo = status;
    return this;
  }

  end() {
    this.ended = true;
    return this;
  }

  json(data) {
    this.jsonData = data;
    return this;
  }
}

describe("submit assignment", () => {
  it("set status to submitted", async () => {
    const req = { body: { email: "test@test.com", password: "123456" } };
    const res = new MockHttpResponse();
    findByEmail.mockImplementation((email) => ({
      _id: "",
      email,
      password: "123456",
      subscription: "pro",
    }));
    comparePassword.mockImplementation(() => true);

    await login(req, res);

    expect(res.statusInfo).toEqual(200);
    expect(res.jsonData.token).toBeDefined();
    expect(res.jsonData.user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
    expect(res.ended).toBeTruthy();
    expect(findByEmail).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalled();
  });
});
