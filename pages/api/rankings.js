require("dotenv").config();
const request = require("request");
// import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  // let userName = req.body.text;
  // const client = await initDatabase();
  // const usersCollection = client.collection("users");
  // const query = await usersCollection.findOne({ name: userName });
  var response = "Workspace Leaderboard:\n";

  res.end(reponse);
}
