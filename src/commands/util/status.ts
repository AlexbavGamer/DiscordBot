import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message, MessageEmbed } from "discord.js";

class UptimeCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "status",
            aliases: ["stats"],
            category: "util",
            permLevel: "User"
        })
    }

    run(message : Message, level : number, ...args : Array<string>)
    {
        const embed = new MessageEmbed()
            .setTitle("** = ESTATISTICAS = **")
            .addField("**Uso da Memoria ::**", `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`)
            .addField("**Tempo Online**", `**${this.client.getUptime()}**`)
            .addField("**PING**", "**PONG**");

        message.channel.send(embed).then(embedMessage => 
        {
            embed.fields[2].value = `**${(embedMessage.createdTimestamp - message.createdTimestamp)}ms**`;
            embedMessage.edit(embed);
        });;
    }
}

export = UptimeCommand;