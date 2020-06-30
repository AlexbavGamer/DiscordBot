import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import MusicUtil from "../../domain/util/MusicUtil";

export default class extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "volume",
            aliases: ["vol"],
            permLevel: "User",
            category: "youtube"
        });
    }

    run(message : Message, level : number, args : Array<string>)
    {
        let serverQueue = this.client.queue.get(message.guild?.id!)!;

        MusicUtil.Volume(message, args, serverQueue);
    }
}