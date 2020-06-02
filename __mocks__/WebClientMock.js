const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;

export default class WebClientMock {
  constructor() {
    console.log("We have created a WebClientMock");
    this.chat = 0;
  }
}
