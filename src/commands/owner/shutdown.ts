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

    async run(message : Message, level : number, ...args : Array<string>)
    {
        this.client.commands.forEach(async (cmd) => {
            await this.client.unloadCommand(cmd.conf.name);
        });
        message.channel.send(`Bot shutting down!`);
        process.exit(1);
    }
}

export default ShutdownCommand;