import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { GuildMember, TextChannel } from "discord.js";

class guildMemberAddEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    run(member : GuildMember)
    {
        const settings = this.client.getSettings(member.guild);

        const welcomeEnabled = settings.welcomeEnabled ? "true" : "false";

        if(welcomeEnabled !== "true") return;
        const welcomeMessage = settings.welcomeMessage.replace("{{user}}", `<@${member.user.id}>`);    

        try
        {
            const channel : TextChannel = <TextChannel>member.guild.channels.cache.find(c => c.name === settings.welcomeChannel);

            console.log(`Welcome Channel: ${channel.name ?? "Undefined"}`);

            channel.send(welcomeMessage).catch(console.error);
        }
        catch(error)
        {
            console.log(error);
        }
    }
}

export = guildMemberAddEvent;