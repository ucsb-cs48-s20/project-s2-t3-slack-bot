require("dotenv").config();
const request = require("request");
import { initDatabase } from "../../utils/mongodb";

export default async function (req, res) {
  if (req.body.text) {
    res.end(req.body.text + " has been praised");
    console.log(req.body.text);
    //const client = await initDatabase();
  }
}
