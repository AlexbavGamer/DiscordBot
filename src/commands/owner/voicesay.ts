import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { sounds } from "soundoftext-js";
import MusicUtil from "../../domain/util/MusicUtil";
export default class extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "voice",
            aliases: ["talk", "falar"],
            permLevel: "Bot Owner",
            category: "owner",
            usage: "voice <text>"
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        let musicQueue = this.client.queue.get(message.guild?.id!);
        MusicUtil.ExecuteCustomURL(message, args, musicQueue!);
    }
}