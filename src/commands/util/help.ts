import { MaytrixXCommand } from "../../domain/MaytrixXCommand"
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

class HelpCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "help",
            category: "util",
            permLevel: "User"
        });
    }

    run(message : Message, level : number, ...args : Array<string>)
    {
        message.channel.send(`Olá <@${message.author.id}> !`);
    }
}

export = HelpCommand;