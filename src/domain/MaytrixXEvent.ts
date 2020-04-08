import { MaytrixXClient } from "./MaytrixXClient";
import { ClientEvents } from "discord.js";

class MaytrixXEvent
{
    private readonly _client : MaytrixXClient;

    public get client()
    {
        return this._client;
    }
    constructor(client : MaytrixXClient)
    {
        this._client = client;
    }

    run<K extends ClientEvents>(...args: any[])
    {
        
    }
}

export { MaytrixXEvent };