import { MaytrixXClient } from "./MaytrixXClient"
import { Message, PermissionResolvable } from "discord.js";

export interface CommandConfig
{
    name: string;
    aliases?: Array<string>
    usage?: string;
    description?: string;
    category: string;
    permission: PermissionResolvable;
}

export abstract class MaytrixXCommand {
    private readonly _conf: CommandConfig;
    private readonly _client: MaytrixXClient;

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

    abstract run(message : Message, ...args : Array<string>) : void;
}