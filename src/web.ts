import { MaytrixXClient } from "./domain/MaytrixXClient";
import { config } from "dotenv";
import { MaytrixXConfig, config as BotConfig, MaytrixXDefaultSettings } from "./domain/MaytrixXConfig";
import * as express from "express";
import { MaytrixXWebPanel } from "./domain/MaytrixXWebPanel";
import path = require("path");
import { join, resolve } from "path";
import { Message as DiscordMessage, Base } from "discord.js";

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


new MaytrixXClient(<MaytrixXConfig>BotConfig, true)