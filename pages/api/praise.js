require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text.slice(1);
  var timeStamp = Math.floor(Date.now() / 1000);

  if (userName == req.body.user_name)
    res.end("You cannot praise yourself, silly.");

  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to praise :)");
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });
    const query2 = await usersCollection.findOne({ name: req.body.user_name });

    if (query2) {
      var lastPraised = query2.lastPraiseTime;
      if (timeStamp - lastPraised < 20) {
        console.log(`Time difference: ${timeStamp - lastPraised}`);
        res.end(`Wait ${20 - timeStamp + lastPraised} seconds to praise again`);
      } else {
        await usersCollection.updateOne(query2, {
          $set: { lastPraiseTime: timeStamp },
        });

        if (query) {
          try {
            await usersCollection.updateOne(query, {
              $set: { praiseValue: query.praiseValue + 1 },
            });
            console.log(`Successfully updated item with _id: ${query._id}`);
            res.end(userName.slice(1) + " has been praised.");
          } catch (err) {
            console.error(`Failed to update item: ${err}`);
          }
        } else {
          const newUser2 = {
            name: userName,
            praiseValue: 1,
            lastPraiseTime: 0,
          };
          try {
            await usersCollection.insertOne(newUser2);
            let query = await usersCollection.findOne({ name: userName });
            console.log(`Successfully inserted item with _id: ${query._id}`);
            res.end(userName.slice(1) + " has been praised.");
          } catch (err) {
            console.error(`Failed to insert item: ${err}`);
          }
        }
      }
    } else {
      const newUser = {
        name: req.body.user_name,
        praiseValue: 0,
        lastPraiseTime: timeStamp,
      };
      await usersCollection.insertOne(newUser);
    }
  }
}
