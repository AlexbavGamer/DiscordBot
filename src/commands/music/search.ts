import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import ReadyEvent from '../../events/ready';
import MusicUtil from "../../domain/util/MusicUtil";

class SearchCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            aliases: ["procurar"],
            guildOnly: true,
            dmOnly: false,
            permLevel: "User",
            name: "search",
            category: "youtube"
        });
    }

    run(message : Message, level : number, args : Array<string>)
    {
        const serverQueue = this.client.queue.get(message.guild!.id);

        MusicUtil.Search(message, args, serverQueue!);
    }
}

export default SearchCommand;