import { MaytrixXCommand } from "../../domain/MaytrixXCommand";	
import { MaytrixXClient } from "../../domain/MaytrixXClient";	
import { Message, MessageEmbed, version } from "discord.js";	

class UptimeCommand extends MaytrixXCommand	
{	
    constructor(client : MaytrixXClient)	
    {	
        super(client, {	
            name: "status",	
            aliases: ["stats"],	
            category: "system",	
            description: "Gives some useful bot statistics",	
            permLevel: "User"	
        })	
    }	

    async run(message : Message, level : number, args : Array<string>)	
    {	
        const embed = new MessageEmbed()	
            .setTitle("** = ESTATISTICAS = **")	
            .addField("** Uso da Memoria ::**", `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`)	
            .addField("** Tempo Online **", `**${this.client.getUptime()}**`)	
            .addField("** Usuarios **", `**${this.client.users.cache.size.toLocaleString()}**`)	
            .addField("** Guildas **", `**${this.client.guilds.cache.size.toLocaleString()}**`)	
            .addField("** Canais **", `**${this.client.channels.cache.size.toLocaleString()}**`)	
            .addField("** Discord.js **", `**v${version}**`)	
            .addField("** Node **", `**${process.version}**`)	
            .addField("**PING**", "**PONG**");	

        message.channel.send(embed).then(embedMessage =>	
        {	
            embed.fields[embed.fields.length-1].value = `**${(embedMessage.createdTimestamp - message.createdTimestamp)}ms**`;	
            embedMessage.edit(embed);	
        });	
    }	
}	

export default UptimeCommand; 