import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { Message } from "discord.js";

class MyLevelCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "mylevel",
            description: "Tells you your permission level for the current message location.",
            category: "system",
            permLevel: "User",
            guildOnly: true,
        });
    }

    async run(message : Message, level : number, args : string[])
    {
        const friendly = this.client.config.permLevels.find(l => l.level == level)!.name;
        message.reply(`Your permission level is: ${level} - ${friendly}`);
    }
}

export default MyLevelCommand;