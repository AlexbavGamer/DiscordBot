import { MaytrixXClient } from "./MaytrixXClient"
import { Message, PermissionResolvable } from "discord.js";

export interface CommandConfig
{
    name: string;
    aliases?: Array<string>
    usage?: string;
    description?: string;
    category: string;
    permLevel: string;
    guildOnly?: boolean;
    dmOnly?: boolean;
}

export abstract class MaytrixXCommand 
{
    private readonly _conf: CommandConfig;
    private readonly _client: MaytrixXClient;
    private _path : string = "";

    public get path()
    {
        return this._path;
    }

    public set path(path : string)
    {
        this._path = path;
    }

    public get conf()
    {
        return this._conf;
    }

    public get client()
    {
        return this._client;
    }

    constructor(client : MaytrixXClient, conf: CommandConfig)
    {
        this._client = client;
        this._conf = conf;
    }

    getCommandPath() : string
    {
        return this._path;
    }

    async shutdown(client : MaytrixXClient) 
    {
        this.client.unloadCommand(this.conf.name);
    }
}