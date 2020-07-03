import { Client, ClientEvents, Guild, Message, Collection, ClientApplication, TextChannel, VoiceChannel, VoiceConnection, StreamDispatcher } from "discord.js";
import { MaytrixXConfig, MaytrixXDefaultSettings, isHerokuInstance, isHerokuDyno } from "./MaytrixXConfig";
import { MaytrixXCommand } from "./MaytrixXCommand";
import { load as loadCommands } from "./CommandHandler";
import { load as loadEvents} from "./EventHandler";
import { MaytrixXEvent } from "./MaytrixXEvent";
import moment = require("moment");
import 'moment/locale/pt-br';
import Enmap = require("enmap");
import { inspect, format } from "util";
import lodash = require("lodash");
import request from "request";
import * as i18n from "i18n";
import { setup } from "../dashboard";
import { Application } from "express";
import { basename, resolve } from "path";
import { createWriteStream, existsSync, mkdirSync, unlink } from "fs";
import { gzip } from "zlib";
import { isUndefined } from "lodash";
import { start } from "../i18n";
import { Team } from "discord.js";
import { GuildMember } from "discord.js";

export interface MusicQueue
{
    textChannel : TextChannel,
    voiceChannel : VoiceChannel,
    connection: VoiceConnection | null,
    dispatcher: StreamDispatcher | null,
    songs: Array<{
        title: string;
        url: string;
        description: string;
        thumbnail : string;
    }>,
    volume: number,
    playing: boolean
}

export class MaytrixXClient extends Client
{
    client: any;

    private readonly _config : MaytrixXConfig;
    private readonly _commands : Collection<string, MaytrixXCommand>;
    private readonly _aliases : Map<string, string>;
    private readonly _events : Map<string, MaytrixXEvent>;
    private readonly _settings : Enmap;
    private readonly _levelCache : Map<string, number>;
    private _queue : Map<string, MusicQueue> = new Map();

    public owners = new Array<string>();

    public get queue()
    {
        return this._queue;
    }

    public get events()
    {
        return this._events;
    }

    public set queue(map : Map<string, MusicQueue>)
    {
        this._queue = map;
    }

    private _application !: ClientApplication;
    private _site !: Application;

    public get application()
    {
        if(this._application === undefined)
        {
            let result = new Promise<ClientApplication>(resolve => {
                this.fetchApplication().then(app => {
                    resolve(app);
                })
            });
    
            result.then(app => {
                this._application = app;
            });
        }

        return this._application;
    }

    public set application(app : ClientApplication)
    {
        this._application = app;
    }

    public get site()
    {
        return this._site;
    }

    public set site(site : Application)
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

    getActivities()
    {
        if(!this._settings.has("activities")) this._settings.set("activities", this._config.activities);
        return this._settings.get("activities") as string[];
    }

    getRandomActivitie()
    {
        return this.formatArgs(lodash.sample(this.getActivities())!);
    }

    addActivitie(value : string)
    {
        let activities = this.getActivities() || null;
        if(activities.includes(value)) return;
        activities.push(value);
        this._settings.set("activities", activities);
    }

    translateGuildText(guild : Guild, pharse : string, ...args : Array<any>)
    {
        let guildSettings = this.getSettings(guild);
        return format(i18n.__({
            locale: guildSettings.language,
            phrase: pharse
        }), ...args);
    }

    formatArgs(text : string)
    {
        let result = text.replaceAll("{{prefix}}", this.config.defaultSettings.prefix)
                         .replaceAll("{{guilds}}", this.guilds.cache.size.toString())
                         .replaceAll("{{port}}", this.config.dashboard.port);
        return result;
    }

    removeActivitie(value : string)
    {
        let activities = this.getActivities();
        let found = activities.find(a => a == value)!;
        let index = activities.indexOf(found);

        activities = activities.filter((value, index) => value != found);

        this._settings.set("activities", activities);
    }

    initSystems()
    {
        setup(this);
    }

    async downloadFile(url : string, dest : string)
    {
        const fileName = basename(url);
        
        let filePath = resolve(dest, fileName);        
        let file = createWriteStream(filePath);

        return await new Promise((resolve, reject) => {
            if(!existsSync(dest))
            {
                mkdirSync(dest);
            }
            if(existsSync(filePath))
            {
                unlink(filePath, (err) => {
                    if(err)
                    {
                        console.log(err);
                    }
                });
            }

            let stream = request({
                uri: url,
                headers:
                {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
                },
                gzip: fileName.includes(".zip") || fileName.includes(".rar"),
            })
            .pipe(file)
            .on('finish', (test) => {
                console.log(`The file is finished downloading..`);
                resolve(file.path);
            })
            .on('error', (error) => {
                reject(error);
            });
        }).catch(err => {
            console.log(`Something happened: ${err}`);
        });
    }

    constructor(config : MaytrixXConfig)
    {

        super();
        this.login(config.token!);
        start(this)
        this._config = config;
        this.fetchApplication().then((app) => {
            this._application = app;
            if(isHerokuDyno("WEB"))
            {
                setup(this);
            }
        });
        this._commands = loadCommands(this);
        this._aliases = new Map();
        this._currentActivitie = 0;
        this._levelCache = new Map();
        for(let i = 0; i < this.config.permLevels!.length; i++)
        {
            const thisLevel = this.config.permLevels[i];
            this._levelCache.set(thisLevel.name, thisLevel.level);
        }
        this._commands.forEach(cmd => 
        {
            if(cmd.conf.permLevel && !(this.levelCache?.has(cmd.conf.permLevel)))
            {
                let permKeys = Array.from(this.levelCache.keys()).filter(key => key.includes(cmd.conf.permLevel));
                console.log(`Invalid permLevel ${cmd.conf.permLevel} from ${cmd.conf.name}, you mean ${permKeys.join(",")}?`);
                this.unloadCommand(cmd.conf.name);
            }
            cmd.conf.aliases?.forEach(alias => {
                this._aliases.set(alias, cmd.conf.name);
            });
        });
        this.generateInvite("ADMINISTRATOR").then(inviteLink =>
        {
            this._config.inviteLink = inviteLink;
        });
        this._settings = new Enmap({
            name: "settings",
            cloneLevel: "deep",
        });
        this._events = loadEvents(this);
        var currentDyno = <string>process.env.DYNO;
        if((!isUndefined(currentDyno) && currentDyno.includes("worker")) || isUndefined(currentDyno))
        {
            this._events.forEach((event, name) => {
                this.on(<any>name,(...args : Array<any>) => {
                    event.run(...args);
                });
            });
        } 
    }

    loadCommand(commandName : string)
    {
        let command = loadCommands(this).get(commandName);
        if(command)
        {
            this.commands.set(command!.conf.name, command!);
            command!.conf.aliases!.forEach(alias => {
                this.aliases.set(alias, command!.conf.name!);
            });
            return false;
        }
        return true;
    }

    loadCommandFromFile(command : MaytrixXCommand)
    {
        if(this.commands.has(command.conf.name) && this.commands.has(this.aliases.get(command.conf.name)!))
        {
            this.unloadCommand(command.conf.name);
        }
        this.commands.set(command!.conf.name, command!);
        command!.conf.aliases!.forEach(alias => {
            this.aliases.set(alias, command!.conf.name!);
        });
        return true;
    }

    async unloadCommand(commandName : string)
    {
        console.log(`Trying to unload ${commandName}`);
        const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName)!);
        if(!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        if(!command.shutdown)
        {
            await command!.shutdown(this);
        }
        if(command.conf.aliases?.length! > 0)
        {
            command.conf.aliases!.forEach(alias => {
                this.aliases.delete(alias);
            });
        }
        this.commands.delete(command.conf.name);
        delete require.cache[`${command.getCommandPath()}`];
        return false;
    }

    async clean(text : Object)
    {
        if(text.constructor.name == "Promise")
        {
            text = await text;
        }
        if(typeof text !== "string")
        {
            text = inspect(text, {depth: 1});
        }
        text = (<string>text).replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replaceAll(this.token!, "")
        .replaceAll(this.config.mongo, "")
        .replaceAll(this.config.youtubeApi, "")
        .replaceAll(this.config.dashboard.oauthSecret, "");

        return text;
    }

    async awaitReply(message : Message, question : string, limit : number = 60000) : Promise<string | boolean>
    {
        const filter = (m : Message) => m.author.id == message.author.id;
        await message.channel.send(question);
        try
        {
            const collected = await message.channel.awaitMessages(filter, {max : 1, time: limit, errors: ["time"]});
            return collected!.first()!.content!;
        }
        catch(e)
        {
            return false;
        }
    }

    async awaitAttachment(message : Message, question : string, limit : number = 60000)
    {
        const filter = (m : Message) => m.author.id == message.author.id;
        await message.channel.send(question);
        try
        {
            const collected = await message.channel.awaitMessages(filter, {max : 1, time : limit, errors: ["time"]});
            return collected!.first()?.attachments.first()!;
        }
        catch(e)
        {
            return null;
        }
    }

    permLevel(message : Message)
    {
        let permlvl = 0;

        const permOrder = this.config.permLevels.slice(0).sort((p,c) => p.level < c.level ? 1 : -1);
        while(permOrder.length)
        {
            const currentLevel = permOrder.shift();
            if(message.guild && currentLevel!.guildOnly) continue;
            if(currentLevel!.check(message, this))
            {
                permlvl = currentLevel!.level;
                break;
            }
        }

        return permlvl;
    }

    writeSettings(id : string, newSettings : {[key : string] : any})
    {
        const defaults = this.settings.get("default");
        let settings = this.settings.get(id) || {};

        this.settings.set(id, {
            ...lodash.pickBy(settings, (v, k) => !lodash.isNil(defaults[k])),
            ...lodash.pickBy(newSettings, (v, k) => !lodash.isNil(defaults[k]))
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
            "welcomeEnabled": "false",
            "language": "en"
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
                    client.login(client.config.token);
                }, 1000);
            }, 4000, this);
        });
    }
}