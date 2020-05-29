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

  //checking if ther user is trying to praise himself
  if (userName == req.body.user_name)
    res.end("You cannot praise yourself, silly.");
  return;

  //checking if the name of the person the user wants to praise is an empty string
  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to praise :)");
    return;
  } else {
    //if not empty initiazlize mongodbdatabase and get the usercollection to access it.
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });
    const query2 = await usersCollection.findOne({ name: req.body.user_name });

    if (query2) {
      //if you are in database lets get the time you last praised
      var lastPraised = query2.lastPraiseTime; //this is last time the user praise someone
      if (timeStamp - lastPraised < 20) {
        // if user has already praisied in last 20 seconds wait for some time to praise again
        console.log(`Time difference: ${timeStamp - lastPraised}`);
        res.end(`Wait ${20 - timeStamp + lastPraised} seconds to praise again`);
        return;
      } else {
        await usersCollection.updateOne(query2, {
          $set: { lastPraiseTime: timeStamp },
        });
      }
    } else {
      //if you are not in database lets add you to mongodb database with the timeStamp which is current time
      const newUser = {
        name: req.body.user_name,
        praiseValue: 0,
        lastPraiseTime: timeStamp,
        lastApraiseTime: 0,
      };
      await usersCollection.insertOne(newUser);
    }

    //if you have not praised in last 20 seconds you are ready to either add a new user with praiseValue 1 or increment their praiseValue
    if (query) {
      //if user exits increment their praiseValue
      try {
        await usersCollection.updateOne(query, {
          $set: { praiseValue: query.praiseValue + 1 },
        });
        console.log(`Successfully updated item with _id: ${query._id}`);
        res.end(userName + " has been praised.");
        return;
      } catch (err) {
        console.error(`Failed to update item: ${err}`);
      }
    } else {
      //if not create a new user you want to praise with praiseValue 1
      const newUser2 = {
        name: userName,
        praiseValue: 1,
        lastPraiseTime: 0,
        lastApraiseTime: 0,
      };
      try {
        await usersCollection.insertOne(newUser2);
        let query = await usersCollection.findOne({ name: userName });
        console.log(`Successfully inserted item with _id: ${query._id}`);
        res.end(userName + " has been praised.");
        return;
      } catch (err) {
        console.error(`Failed to insert item: ${err}`);
      }
    }
  }
}
