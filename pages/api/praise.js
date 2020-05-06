require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text;

  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to praise :)");
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });

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
      const newUser = {
        name: userName,
        praiseValue: 1,
      };
      try {
        await usersCollection.insertOne(newUser);
        console.log(`Successfully inserted item with _id: ${query._id}`);
        res.end(userName.slice(1) + " has been praised.");
      } catch (err) {
        console.error(`Failed to insert item: ${err}`);
      }
    }
  }
}
