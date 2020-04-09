import { MaytrixXClient } from "./domain/MaytrixXClient";
import { config } from "dotenv";
import { MaytrixXConfig } from "./domain/MaytrixXConfig";
import * as express from "express";
import { MaytrixXWebPanel } from "./domain/MaytrixXWebPanel";
config({path: __dirname + "/../src/.env"});

let cfg = require("../src/bot.json") as MaytrixXConfig;

declare global
{
    namespace NodeJS{
        interface Global
        {
            __BOT__ : MaytrixXClient;
            __BOT_WEBPANEL__ : MaytrixXWebPanel
        }
    }
}

global.__BOT__ = new MaytrixXClient(process.env.BOT_TOKEN!, cfg);