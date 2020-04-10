import { Client, ClientEvents, Guild, Message, Collection, ClientApplication } from "discord.js";
import { MaytrixXConfig, MaytrixXDefaultSettings } from "./MaytrixXConfig";
import { MaytrixXCommand } from "./MaytrixXCommand";
import { load as loadCommands } from "./CommandHandler";
import { load as loadEvents} from "./EventHandler";
import { MaytrixXEvent } from "./MaytrixXEvent";
import * as moment from "moment";
import 'moment/locale/pt-br';
import Enmap = require('enmap');
import { inspect } from "util";
import _ = require("lodash");
import { Server } from "http";
import { setup } from "./util/Dashboard";
export class MaytrixXClient extends Client
{
    private readonly _config : MaytrixXConfig;
    private readonly _commands : Collection<string, MaytrixXCommand>;
    private readonly _aliases : Map<string, string>;
    private readonly _events : Map<string, MaytrixXEvent>;
    private readonly _settings : Enmap;
    private readonly _levelCache : Map<string, number>;
    
    private _appInfo !: ClientApplication;
    private _site !: Server;

    public get appInfo()
    {
        return this._appInfo;
    }

    public get site()
    {
        return this._site;
    }

    public set site(site : Server)
    {
        this._site = site;
    }

    private _currentActivitie ?: number;

    public get currentActivitie()
    {
        return this._currentActivitie!;
    }

    public set currentActivitie(n : number)
    {
        this._currentActivitie = n;
    }

    public get levelCache()
    {
        return this._levelCache;
    }

    public get config()
    {
        return this._config;
    }

    public get aliases()
    {
        return this._aliases;
    }

    public get settings()
    {
        return this._settings;
    }

    public get commands()
    {
        return this._commands;
    }

    constructor(config : MaytrixXConfig)
    {
        super();
        moment.defineLocale("pt-BR", {});
        this.login(config.token!);
        this._commands = loadCommands(this);
        this._aliases = new Map();
        this._currentActivitie = 0;
        this._commands.forEach((cmd) => {
            cmd.conf.aliases?.forEach((alias) => {
                this._aliases.set(alias, cmd.conf.name);
            });
        });
        this._events = loadEvents(this);
        this._config = config;
        this.generateInvite("ADMINISTRATOR").then(inviteLink => 
        {
            this._config.inviteLink = inviteLink;
        });
        this._settings = new Enmap({
            name: "settings",
            cloneLevel: "deep",
        });
        this._events.forEach((event, name) => {
            this.on(<any>name,(...args : Array<any>) => {
                event.run(...args);
            });
        });

        this._levelCache = new Map();
        for(let i = 0; i < this.config.permLevels!.length; i++)
        {
            const thisLevel = this.config.permLevels[i];
            this._levelCache.set(thisLevel.name, thisLevel.level);
        }
        this.fetchApplication().then((app) => {
            this._appInfo = app;
        });
        setup(this);
    }

    async clean(text : Object)
    {
        if(text.constructor.name == "Promise")
        {
            text = await text;
        }
        if(typeof text !== "string")
        {
            text = inspect(text, {depth: 0});
        }
        text = (<string>text).replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(this.token!, this.config.token);

        return text;
    }

    async awaitReply(message : Message, question : string, limit : number = 60000) : Promise<string | boolean>
    {
        const filter = (m : Message) => m.author.id == message.author.id;
        await message.channel.send(question);
        try
        {
            const collected = await message.channel.awaitMessages(filter, {max : 1, time: limit, errors: ["time"]});
            return collected.first()?.content!;
        }
        catch(e)
        {
            return false;
        }
    }

    permLevel(message : Message)
    {
        let permlvl = 0;

        const permOrder = this.config.permLevels.slice(0).sort((p,c) => p.level < c.level ? 1 : -1);
        while(permOrder.length)
        {
            const currentLevel = permOrder.shift();
            if(message.guild && currentLevel?.guildOnly) continue;
            if(currentLevel?.check(message, this))
            {
                permlvl = currentLevel.level;
                break;
            }
        }

        return permlvl;
    }

    writeSettings(id : string, newSettings : any)
    {
        const defaults = this.settings.get("default");
        let settings = this.settings.get(id) || {};
        
        this.settings.set(id, {
            ..._.pickBy(settings, (v, k) => !_.isNil(defaults[k])),
            ..._.pickBy(newSettings, (v, k) => !_.isNil(defaults[k]))
        });
    }

    getSettings(guild : Guild) : MaytrixXDefaultSettings
    {
        this.settings.ensure("default", {
            "prefix": "!",
            "modLogChannel": "mod-log",
            "modRole": "Moderator",
            "adminRole": "Administrator",
            "systemNotice": "true",
            "welcomeChannel": "welcome",
            "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
            "welcomeEnabled": "false"
        });

        if(!guild) return this.settings.get("default");
        const guildConf = this.settings.get(guild.id) || {};
        return ({...this.settings.get("default"), ...guildConf});
    }

    getUptime()
    {
        let uptime = process.uptime();
        const date = new Date(uptime*1000);
        const days = date.getUTCDate() - 1,
              hours = date.getUTCHours(),
              minutes = date.getUTCMinutes(),
              seconds = date.getUTCSeconds(),
              milliseconds = date.getUTCMilliseconds();

        let segments = [];

        if (days > 0) segments.push(days + ' dia' + ((days == 1) ? '' : 's'));
        if (hours > 0) segments.push(hours + ' hora' + ((hours == 1) ? '' : 's'));
        if (minutes > 0) segments.push(minutes + ' minuto' + ((minutes == 1) ? '' : 's'));
        if (seconds > 0) segments.push(seconds + ' segundo' + ((seconds == 1) ? '' : 's'));
        if (milliseconds > 0) segments.push(milliseconds + ' milissegundo' + ((seconds == 1) ? '' : 's'));
        const dateString = segments.join(', ');
        return dateString;
    }

    restart() : Promise<void>
    {
        console.log("Reiniciando bot");
        return new Promise<void>(() => {
            setTimeout((client : MaytrixXClient) => {
                client.destroy();

                setTimeout(() => {
                    client.login(process.env.BOT_TOKEN!);   
                }, 1000);
            }, 4000, this);
        });
    }
}