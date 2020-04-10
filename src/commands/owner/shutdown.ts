import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

class ShutdownCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "shutdown",
            description: "Shutdown the bot",
            category: "owner",
            permLevel: "Bot Owner",
        });
    }

    run(message : Message, level : number, ...args : Array<string>)
    {
        this.client.destroy();
    }
}

export = ShutdownCommand;