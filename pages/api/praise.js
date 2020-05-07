require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  let userName = req.body.text;
  if(userName.slice(1) == req.body.user_name){res.end('You cannot praise yourself, silly.')}
  if (!userName || userName.trim() === "") {
    res.end("Please tag the person you want to praise :)");
  } else {
    const client = await initDatabase();
    const usersCollection = client.collection("users");
    const query = await usersCollection.findOne({ name: userName });
  if(userName.slice(1) != req.body.user_name){
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
          let query = await usersCollection.findOne({ name: userName });
          console.log(`Successfully inserted item with _id: ${query._id}`);
          res.end(userName.slice(1) + " has been praised.");
        } catch (err) {
          console.error(`Failed to insert item: ${err}`);
        }
      }
    }
  }
}
