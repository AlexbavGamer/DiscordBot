import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import ReadyEvent from '../../events/ready';
import MusicUtil from "../../domain/util/MusicUtil";

class PlayCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            aliases: ["tocar"],
            guildOnly: true,
            dmOnly: false,
            description: "Play any music from youtube, just paste link",
            permLevel: "User",
            name: "play",
            category: "youtube"
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        const serverQueue = this.client.queue.get(message.guild!.id);

        MusicUtil.Execute(message, serverQueue!);
    }
}

export default PlayCommand;