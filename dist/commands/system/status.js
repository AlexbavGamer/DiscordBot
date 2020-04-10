"use strict";
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
const discord_js_1 = require("discord.js");
class UptimeCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "status",
            aliases: ["stats"],
            category: "system",
            description: "Gives some useful bot statistics",
            permLevel: "User"
        });
    }
    run(message, level, ...args) {
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("** = ESTATISTICAS = **")
            .addField("** Uso da Memoria ::**", `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`)
            .addField("** Tempo Online **", `**${this.client.getUptime()}**`)
            .addField("** Usuarios **", `**${this.client.users.cache.size.toLocaleString()}**`)
            .addField("** Guildas **", `**${this.client.guilds.cache.size.toLocaleString()}**`)
            .addField("** Canais **", `**${this.client.channels.cache.size.toLocaleString()}**`)
            .addField("** Discord.js **", `**v${discord_js_1.version}**`)
            .addField("** Node **", `**${process.version}**`)
            .addField("**PING**", "**PONG**");
        message.channel.send(embed).then(embedMessage => {
            embed.fields[embed.fields.length - 1].value = `**${(embedMessage.createdTimestamp - message.createdTimestamp)}ms**`;
            embedMessage.edit(embed);
        });
    }
}
module.exports = UptimeCommand;
