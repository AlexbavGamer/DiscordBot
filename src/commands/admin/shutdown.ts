import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

class ShutdownCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "shutdown",
            category: "admin",
            permission: ["ADMINISTRATOR"]
        });
    }

    run(message : Message, ...args : Array<string>)
    {
        this.client.destroy();
    }
}

export = ShutdownCommand;