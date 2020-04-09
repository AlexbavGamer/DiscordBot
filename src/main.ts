import { MaytrixXClient } from "./domain/MaytrixXClient";
import { config } from "dotenv";
import { MaytrixXConfig, config as BotConfig } from "./domain/MaytrixXConfig";
import * as express from "express";
import { MaytrixXWebPanel } from "./domain/MaytrixXWebPanel";
import path = require("path");
import { join, resolve } from "path";
config({path: __dirname + "/../src/.env"});

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

global.__BOT__ = new MaytrixXClient(process.env.BOT_TOKEN!, <MaytrixXConfig>BotConfig);