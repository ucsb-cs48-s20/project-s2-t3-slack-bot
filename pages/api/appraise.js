require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text;
  if (userName === undefined) {
    res.end("No username found. Please try again!");
    return;
  }
  userName = userName.slice(1);
  var timeStamp = Math.floor(Date.now() / 1000);

  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to view :)");
    return;
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });
    const query2 = await usersCollection.findOne({ name: req.body.user_name });
    if (query2) {
      //if you are in database lets get the time you last apraised
      var lastPraised = query2.lastApraiseTime; //this is last time the user apraised someone
      console.log(lastPraised);
      if (timeStamp - lastPraised < 6) {
        res.end(`Wait ${6 - timeStamp + lastPraised} seconds to apraise again`);
        return;
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
        res.end(userName + " has " + query.praiseValue.toString(10) + " rep!");
        return;
      } else {
        res.end(userName + " has no rep. :(");
        return;
      }
    } else {
      res.end(userName + " is not in our database. :(");
      return;
    }
  }
}
