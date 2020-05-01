import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import MusicUtil from "../../domain/util/MusicUtil";

class SkipCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            aliases: ["pular"],
            guildOnly: true,
            dmOnly: false,
            permLevel: "User",
            name: "skip",
            category: "youtube"
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        const serverQueue = this.client.queue.get(message.guild!.id);
        MusicUtil.Skip(message, serverQueue!);
    }
}

export default SkipCommand;