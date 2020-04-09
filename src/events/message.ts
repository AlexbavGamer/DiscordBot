import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { Message } from "discord.js";
import { MaytrixXCommand } from "../domain/MaytrixXCommand";
import { inspect } from "util";

class MessageEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    async run(message : Message)
    {
       if(message.author.bot) return;

       const settings = this.client.getSettings(message!.guild!);

       const prefixMention = new RegExp(`^<@!?${this.client.user?.id}>( |)$`);
       if(message.content.match(prefixMention))
       {
            return message.reply(`Meu prefixo nesse servidor é ${settings.prefix}`);
       }
       if(message.content.indexOf(settings.prefix) !== 0) return;
       
       const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
       const command = args.shift()!.toLowerCase();

       if(message.guild && !message.member) await message.guild!.members.fetch({
           user: message.author
       });

       const level = this.client.permLevel(message);

       const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command)!);
       if(!cmd) return;

       if(cmd && !message.guild && cmd.conf.guildOnly)
       {
           return message.channel.send(`This command is unavailable via private message. Please run this command in a guild.`);
       }

       if(level < this.client.levelCache.get(cmd.conf.permLevel)!)
       {
            if(settings.systemNotice)
            {
                return message.channel.send(`You do not have permission to use this command.
                You permission level is ${level} (${this.client.config.permLevels.find(l => l.level == level)?.name}) This command requires level 
                ${this.client.levelCache.get(cmd.conf.permLevel)} (${cmd.conf.permLevel})`);
            }
            else{
                return;
            }
       }

       let flags = [];
       while(args[0] && args[0][0] === "-")
       {
           flags.push(args.shift()?.slice(1));
       }
       message.flags.serialize(flags);
       (<any>cmd).run(message, level, args);
    }
}

export = MessageEvent;