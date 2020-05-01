import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import MusicUtil from "../../domain/util/MusicUtil";

class StopCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            aliases: ["parar"],
            guildOnly: true,
            dmOnly: false,
            permLevel: "User",
            name: "stop",
            category: "youtube"
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        const serverQueue = this.client.queue.get(message.guild!.id);
        MusicUtil.Stop(message, serverQueue!);
    }
}

export default StopCommand;