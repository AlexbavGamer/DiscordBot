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
        if(!commandName)  return message.reply(message.translateGuildText("reload_no_args"));
        let response = await this.client.unloadCommand(commandName);
        if(response) return message.reply(message.translateGuildText("reload_unloading_error", response));

        response = this.client.loadCommand(commandName);
        if (response) return message.reply(message.translateGuildText("reload_loading_error", response));

        message.reply(message.translateGuildText("reload_success", commandName));
    }
}

export default ReloadCommand;