require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text;
  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to view :)");
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });
    if (query.praiseValue != 0) {
      console.log("Successfully found user");
      res.end(
        userName.slice(1) + " has " + query.praiseValue.toString(10) + " rep!"
      );
    } else {
      res.end(userName.slice(1) + " has no rep. :(");
    }
  }
}
