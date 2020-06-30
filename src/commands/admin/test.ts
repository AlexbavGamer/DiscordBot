import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { Message } from "discord.js";

export default class TestCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "test",
            category: "system",
            permLevel: "User",
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        message.reply("Este comando é um teste");
    }
}