require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text;
  if (userName === undefined) {
    res.end("No username found. Please try again!");
    return;
  }
  userName = req.body.team_id + userName.slice(1);
  console.log("Username of target: " + userName);
  var timeStamp = Math.floor(Date.now() / 1000);

  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to view :)");
    return;
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const appraisee = await usersCollection.findOne({ name: userName });
    const appraiser = await usersCollection.findOne({
      name: req.body.team_id + req.body.user_name,
    });
    if (appraiser) {
      //if you are in database lets get the time you last apraised
      var lastPraised = appraiser.lastApraiseTime; //this is last time the user apraised someone
      // console.log(lastPraised);
      if (timeStamp - lastPraised < 6) {
        res.end(
          `Wait ${6 - timeStamp + lastPraised} seconds to appraise again`
        );
        return;
      } else {
        await usersCollection.updateOne(appraiser, {
          $set: { lastApraiseTime: timeStamp },
        });
      }
    } else {
      const newUser = {
        name: req.body.team_id + req.body.user_name,
        praiseValue: 0,
        lastPraiseTime: 0,
        lastApraiseTime: timeStamp,
      };
      await usersCollection.insertOne(newUser);
    }

    if (appraisee) {
      if (appraisee.praiseValue != 0) {
        // console.log("Successfully found user");
        res.end(
          req.body.text.slice(1) +
            " has " +
            appraisee.praiseValue.toString(10) +
            " rep!"
        );
        return;
      } else {
        res.end(req.body.text.slice(1) + " has no rep. :(");
        return;
      }
    } else {
      res.end(req.body.text.slice(1) + " is not in our database. :(");
      return;
    }
  }
}
