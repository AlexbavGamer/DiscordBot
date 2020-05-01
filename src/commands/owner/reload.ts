import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

class ReloadCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            guildOnly: false,
            aliases: [],
            permLevel: "Bot Admin",
            name: "reload",
            category: "owner",
            description: "Reloads a command that\"s been modified."
        });
    }

    async run(message : Message, level : number, [commandName, ...values] : [string, string[]])
    {
        if(!commandName)  return message.reply("Must provide a command to reload. Derp.");
        let response = await this.client.unloadCommand(commandName);
        if(response) return message.reply(`Error Unloading: ${response}`);

        response = this.client.loadCommand(commandName);
        if (response) return message.reply(`Error Loading: ${response}`);

        message.reply(`The command \`${commandName}\` has been reloaded`);

    }
}

export default ReloadCommand;