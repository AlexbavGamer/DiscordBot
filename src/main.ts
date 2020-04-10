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

declare global
{
    interface String
    {
        Truncate(maxLength : number, side : string, ellipsis : string) : string;
        toProperCase() : string;
    }
}

String.prototype.toProperCase = function()
{
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt : string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

String.prototype.Truncate = function(maxLength : number, side : string, ellipsis : string = "...") : string
{
    var str = this;
    if(str.length > maxLength)
    {
        switch(side)
        {
            case "start":
                {
                    return ellipsis + str.slice(-(maxLength - ellipsis.length));
                }
            case "end":
                {
                    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
                }
        }
    }
    return str.toString();
};

global.__BOT__ = new MaytrixXClient(<MaytrixXConfig>BotConfig); 
