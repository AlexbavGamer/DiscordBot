import { MaytrixXCommand } from "../../domain/MaytrixXCommand"
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { exec } from "child_process";
class RestartCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "restart",
            description: "restart the bot",
            category: "owner",
            permLevel: "Bot Admin"
        });
    }

    async run(message : Message, level : number, ...args : Array<string>)
    {
        message.reply(`Getting last project version: `);
        exec("chmod 777 ./git.sh && ./git.sh && refresh", (err, out) => {
            console.log(out);
            message.reply(out);
        });
    }
}

export default RestartCommand;