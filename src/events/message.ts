import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { Message, BitFieldResolvable, BitField } from "discord.js";
import { inspect } from "util";
class MessageEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    async run(message : Message)
    {
        if(this.client.isWebSetup) return;
        if(message.author.bot) return; 
        const settings = this.client.getSettings(message!.guild!);
 
        const prefixMention = new RegExp(`^<@!?${this.client.user?.id}> ?$`);
        if(message.content.match(prefixMention))
        {
            return message.reply(this.client.translateGuildText(message?.guild!, "say_prefix", settings.prefix));
        }

        const prefixes = [settings.prefix, `<@!${this.client.user?.id}>`]

        const prefix = prefixes.find(p => message.content.startsWith(p));


        if(message.content.indexOf(prefix!) !== 0) return;
        
        const args = message.content.slice(prefix!.length).trim().split(/ +/g);
 
        const command = args.shift()!.toLowerCase();
 
        if(message.guild && !message.member) await message.guild!.members.fetch({
            user: message.author
        });
 
        const level = this.client.permLevel(message);
 
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command)!);
        if(!cmd) return;
 
        if(cmd && !message.guild && cmd.conf.guildOnly)
        {
            return message.channel.send(this.client.translateGuildText(message?.guild!, "command_only_guild"));
        }

        if(cmd && message.guild && cmd.conf.dmOnly)
        {
            return message.channel.send(this.client.translateGuildText(message?.guild!, "command_only_dm"));

        }
 
        if(level < this.client.levelCache.get(cmd.conf.permLevel)!)
        {
             if(settings.systemNotice)
             {
                 return message.channel.send(this.client.translateGuildText(message?.guild!, "command_no_permission", level, this.client.config.permLevels.find(l => l.level == level)?.name, this.client.levelCache.get(cmd.conf.permLevel), cmd.conf.permLevel));
             }
             else{
                 return;
             }
        }
 
        let flags = [];
        while(args[0] && args[0][0] === "-")
        {
            flags.push(args.shift()!.slice(1)!);
        }
        if(flags.length == 0)
        {
            (<any>cmd).run(message, level, args); 
        }
        else
        {
            (<any>cmd).run(message, level, args, flags); 
        }
    }
}

export default MessageEvent;