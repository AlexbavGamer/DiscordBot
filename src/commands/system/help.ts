import { MaytrixXCommand } from "../../domain/MaytrixXCommand"
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { inspect } from "util";
import { CommandCategoryEmojis } from "../../domain/MaytrixXConfig";

class HelpCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "help",
            aliases: ["h"],
            usage: "help [command]",
            description: "Displays all the available commands for your permission level.",
            category: "system",
            permLevel: "User"
        });
    }

    run(message : Message, level : number, args : Array<string>)
    {
        if(!args[0])
        {
            const settings = this.client.getSettings(message!.guild!);

            const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache.get(cmd.conf.permLevel)! <= level) : this.client.commands.filter(cmd => this.client.levelCache.get(cmd.conf.permLevel)! <= level && cmd.conf.guildOnly !== true);

            const commandNames = myCommands.map((cmd) => cmd.conf.name);
            const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

            const CommandCategories : Map<string, Array<MaytrixXCommand>> = new Map();
            const sorted = myCommands.sort((p, c) => p.conf.category > c.conf.category ? 1 : p.conf.name > c.conf.name && p.conf.category == c.conf.category ? 1 : -1);
            sorted.forEach(c => {
                const cat = c.conf.category.toLowerCase();
                if(!CommandCategories.has(cat))
                {
                    CommandCategories.set(cat, new Array());
                }

                CommandCategories.get(cat)!.push(c);
            });

            let embed = new MessageEmbed();

            embed.setTitle(`Olá ${message.author.username} para ver os comandos apenas reaja.`);

            var desc = '';
            CommandCategories.forEach((cmds, cat) => {
                let emoji = CommandCategoryEmojis[cat] == null ? CommandCategoryEmojis[cat] : null;
                if(emoji)
                {
                    desc += `${emoji} - ${cat} (${CommandCategories.get(cat)!.length})\n`;
                }
            });
            desc += '\n\nClique em uma dessas para acessar';
            embed.setDescription(desc);
            const sendMessage = message.channel.send(embed);

            CommandCategories.forEach(async (_, cat) => {
                let emoji = CommandCategoryEmojis[cat].toString();

                (await sendMessage).react(emoji);
            });

            let map : string[] = [];
            CommandCategories.forEach((cmds, cat) => {
                map.push(CommandCategoryEmojis[cat]);
            });

            const filter = (reaction : MessageReaction, user : User) =>
            {
                return map.includes(reaction.emoji.name) && user.id == message.author.id;
            }

            sendMessage.then(message => {
                message.awaitReactions(filter, {max: 1, time: 15000, errors:['time']}).then(collected => {
                    const reaction = collected.first()!;

                    let list : string[] = [];
                    CommandCategories.forEach((cmds, cat) => {
                        let emoji = CommandCategoryEmojis[cat];
                        let commands = cmds.filter((cmd) =>
                        {
                            return reaction.emoji.name === CommandCategoryEmojis[cat];
                        });

                        commands.forEach(cmd => {
                            let info = `${cmd.conf.name}: ${cmd.conf.usage == null ? cmd.conf.usage  : "Usage not defined"}\n`;
                            info += `${cmd.conf.description ? `Descrição:\n\t${cmd.conf.description}` : ""}\n`;
                            info += `Permissão:\n\t${cmd.conf.permLevel}\n\n`;
                            list.push(info);
                        });
                    });

                    message.channel.send(list.join("\n"), { code : 'asciidoc'});
                });
            });
        }
        else
        {
            let command : MaytrixXCommand;
            if (this.client.commands!.has(args[0])) {
            command = this.client.commands.get(args[0])!;
            if (level < this.client.levelCache.get(command.conf.permLevel)!) return;
                message.channel.send(`= ${command.conf.name} = \n${command.conf.description}\nusage::${command.conf.usage}`, {code:"asciidoc"});
            }
        }
    }
}

export default HelpCommand;