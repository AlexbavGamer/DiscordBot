import { Client, ClientEvents } from "discord.js";
import { MaytrixXConfig } from "./MaytrixXConfig";
import { MaytrixXCommand } from "./MaytrixXCommand";
import { load as loadCommands } from "./CommandHandler";
import { load as loadEvents} from "./EventHandler";
import { MaytrixXEvent } from "./MaytrixXEvent";
import * as moment from "moment";
import 'moment/locale/pt-br';
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
        moment.defineLocale("pt-BR", {});
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