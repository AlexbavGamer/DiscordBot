import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { Guild } from "discord.js";

export default class extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    async run(guild : Guild)
    {
        if(!guild.available) return;

        console.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot`);

        if(this.client.settings.has(guild.id))
        {
            this.client.settings.delete(guild.id);
        }
    }
}