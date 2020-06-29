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
        console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner?.user.tag} (${guild.owner?.user.id})`);
    
        let guildSettings = this.client.getSettings(guild);

        if(guildSettings.language == null)
        {
            let language = guild.getLanguageByRegion();
            this.client.writeSettings(guild!.id, {
                "language": language
            });
        }
    }
}