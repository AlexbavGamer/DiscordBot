import { Client, ClientEvents } from "discord.js";
import { MaytrixXConfig } from "./MaytrixXConfig";
import { MaytrixXCommand } from "./MaytrixXCommand";
import { load as loadCommands } from "./CommandHandler";
import { load as loadEvents} from "./EventHandler";
import { MaytrixXEvent } from "./MaytrixXEvent";
import { Moment } from "moment";
import moment = require("moment");
export class MaytrixXClient extends Client
{
    private readonly _config : MaytrixXConfig;
    private readonly _commands : Map<string, MaytrixXCommand>;
    private readonly _events : Map<string, MaytrixXEvent>;

    public get config()
    {
        return this._config;
    }

    public get commands()
    {
        return this._commands;
    }

    constructor(token : string, config : MaytrixXConfig)
    {
        super();
        this.login(token!);
        this._commands = loadCommands(this);
        this._events = loadEvents(this);
        this._config = config;

        this._events.forEach((event, name) => {
            this.on(<any>name,(...args : Array<any>) => {
                event.run(...args);
            });
        });
    }

    getUptime()
    {
        const duration = moment.duration(this.uptime?.valueOf()).humanize();

        return duration;
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