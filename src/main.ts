import { MaytrixXClient } from "./domain/MaytrixXClient";
import { config } from "dotenv";
import { MaytrixXConfig } from "./domain/MaytrixXConfig";

if(process.env.NODE_ENV && process.env.NODE_ENV !== "production")
{
    config({path: __dirname + "/../src/.env"});
}

let cfg = require("../src/bot.json") as MaytrixXConfig;

const client : MaytrixXClient = new MaytrixXClient(process.env.BOT_TOKEN!, cfg);

console.log(process.env.NODE_ENV);