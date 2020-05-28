require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text.slice(1);
  var timeStamp = Math.floor(Date.now() / 1000);

  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to view :)");
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });
    const query2 = await usersCollection.findOne({ name: req.body.user_name });
    if (query2) {
      //if you are in database lets get the time you last apraised
      var lastPraised = query2.lastPraiseTime; //this is last time the user apraised someone
      if (timeStamp - lastPraised < 4) {
        res.end(`Wait ${4 - timeStamp + lastPraised} seconds to apraise again`);
      } else {
        await usersCollection.updateOne(query2, {
          $set: { lastApraiseTime: timeStamp },
        });
      }
    } else {
      const newUser = {
        name: req.body.user_name,
        praiseValue: 0,
        lastPraiseTime: 0,
        lastApraiseTime: timeStamp,
      };
      await usersCollection.insertOne(newUser);
    }

    if (query) {
      if (query.praiseValue != 0) {
        console.log("Successfully found user");
        res.end(
          userName.slice(1) + " has " + query.praiseValue.toString(10) + " rep!"
        );
      } else {
        res.end(userName.slice(1) + " has no rep. :(");
      }
    } else {
      res.end(userName.slice(1) + " is not in our database. :(");
    }
  }
}
