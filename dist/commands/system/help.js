"use strict";
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
class HelpCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "help",
            aliases: ["h"],
            usage: "help [command]",
            description: "Displays all the available commands for your permission level.",
            category: "system",
            permLevel: "User"
        });
    }
    run(message, level, args) {
        if (!args[0]) {
            const settings = this.client.getSettings(message.guild);
            const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache.get(cmd.conf.permLevel) <= level) : this.client.commands.filter(cmd => this.client.levelCache.get(cmd.conf.permLevel) <= level && cmd.conf.guildOnly !== true);
            const commandNames = myCommands.map((cmd) => cmd.conf.name);
            const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
            let currentCategory = "";
            let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n`;
            const sorted = myCommands.sort((p, c) => p.conf.category > c.conf.category ? 1 : p.conf.name > c.conf.name && p.conf.category == c.conf.category ? 1 : -1);
            sorted.forEach(c => {
                const cat = c.conf.category.toProperCase();
                if (currentCategory !== cat) {
                    output += `\n==${cat} ==\n`;
                    currentCategory = cat;
                }
                output += `${settings.prefix}${c.conf.name}${" ".repeat(longest - c.conf.name.length)} :: ${c.conf.description}\n`;
            });
            message.channel.send(output, {
                code: 'asciidoc'
            });
        }
        else {
            let command;
            if (this.client.commands.has(args[0])) {
                command = this.client.commands.get(args[0]);
                if (level < this.client.levelCache.get(command.conf.permLevel))
                    return;
                message.channel.send(`= ${command.conf.name} = \n${command.conf.description}\nusage::${command.conf.usage}`, { code: "asciidoc" });
            }
        }
    }
}
module.exports = HelpCommand;
