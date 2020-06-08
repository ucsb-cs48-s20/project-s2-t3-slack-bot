require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  var lb_size = 3; //change this when we add a front end to import from config file
  const client = await initDatabase();
  const usersCollection = client.collection("users");
  const query = await usersCollection
    .find({})
    .sort({ praiseValue: -1 })
    .limit(lb_size)
    .toArray();
  var response = "Workspace Leaderboard:\n";
  for (var i = 0; i < query.length; i++) {
    response += query[i].name.slice(req.body.team_id.length);
    response += ": ";
    response += query[i].praiseValue;
    response += "\n";
  }
  res.end(response);
}
