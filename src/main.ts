import { MaytrixXClient } from "./domain/MaytrixXClient";
import { config as dotenv } from "dotenv";
import { MaytrixXConfig, MaytrixXDefaultSettings} from "./domain/MaytrixXConfig";
import config from "./domain/MaytrixXConfig";
import { DiscordAPIError, Message } from "discord.js";
import i18n from "i18n";
import { format } from "util";
import { Guild } from "discord.js";

dotenv({path: __dirname + "/../src/.env"});

interface IGlobalVar {
    __CLIENT__: boolean;
    __SERVER__: boolean;
    __DEV__: boolean;
    __TEST__: boolean;
    bot : MaytrixXClient;
}

declare global
{
	interface NodeModule
	{
		hot: {
			accept: Function
		}
	}

	namespace NodeJS {
		interface Global extends IGlobalVar {  }
	}

	interface Window extends IGlobalVar {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
		__PRELOADED_STATE__: any;
    }

    interface Array<T>
    {
        flat(depth : number) : any[];
    }

    namespace Express
    {
        interface Session
        {
            [key : string] : any
        }
    }
}

declare module 'discord.js'
{
    interface Message
    {
        settings : MaytrixXDefaultSettings;
        translateGuildText(pharse : string, ...args : Array<any>) : string;
    }

    interface User
    {
        permLevel : number;
    }

    interface Guild
    {
        getLanguageByRegion() : string;
    }
}

declare global
{
  interface String
  {
    Truncate(maxLength : number, side : string, ellipsis : string) : string;
    replaceAll(find : string, replace : string) : string;
    toProperCase() : string;
  }
}


String.prototype.replaceAll = function(find : string, replace : string)
{
    return this.replace(new RegExp(find, 'g'), replace);
}

String.prototype.toProperCase = function()
{
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt : string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

Guild.prototype.getLanguageByRegion = function()
{
    var language : string = "en";
    switch(this.region)
    {
        case "brazil": 
        {
            language = "pt-br";
            break;
        }
        case "us-central":
        {
            language = "en";
            break;
        }
    }
    return language;
}

Message.prototype.translateGuildText = function(pharse : string, ...args: any[])
{
    if(this.channel.type != "dm")
    {
        var guildSettings = this.settings;
        return format(i18n.__({
            locale: guildSettings.language,
            phrase: pharse
        }), ...args);
    }
    return "";
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

Array.prototype.flat = function(depth = 1)
{
    return this.reduce((flat, toFlatten) => {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
}

global.bot = new MaytrixXClient(<MaytrixXConfig>config);