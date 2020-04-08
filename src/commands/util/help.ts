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
            permission: ["SEND_MESSAGES"]
        });
    }

    run(message : Message, ...args : Array<string>)
    {
        message.channel.send(`Olá <@${message.author.id}> !`);
    }
}

export = HelpCommand;