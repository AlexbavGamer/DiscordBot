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

        if(settings.welcomeEnabled !== true) return;

        const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);    

        const channel : TextChannel = <TextChannel>member.guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        channel.send(welcomeMessage).catch(console.error);
    }
}

export = guildMemberAddEvent;