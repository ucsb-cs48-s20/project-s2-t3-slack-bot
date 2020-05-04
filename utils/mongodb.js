import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let connected = false;

export async function initDatabase() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
  console.log("connected to mongoDB");
  return client.db("database");
}
