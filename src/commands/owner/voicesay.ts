import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import MusicUtil from "../../domain/util/MusicUtil";
export default class extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "voice",
            aliases: ["talk", "falar"],
            permLevel: "Bot Owner",
            category: "owner",
            usage: "voice <text>"
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        let musicQueue = this.client.queue.get(message.guild?.id!);

        let userMention = message.mentions.users.map(user => user);
        let channelMention = message.mentions.channels.map(channel => channel);
        let roleMention = message.mentions.roles.map(role => role);

        userMention.forEach(mention => {
            args.forEach((value, index) => 
            {
                if(value.includes(`<@!${mention.id}>`))
                {
                    args[index] = args[index].replace(`<@!${mention.id}>`, mention.username);
                }
            });
        });

        channelMention.forEach(mention => {
            args.forEach((value, index) => 
            {
                if(value.includes(`<#${mention.id}>`))
                {
                    args[index] = args[index].replace(`<#${mention.id}>`, mention.name);
                }
            });
        });

        roleMention.forEach(mention => {
            args.forEach((value, index) => {
                if(value.includes(`<@&${mention.id}>`))
                {
                    args[index] = args[index].replace(`<@&${mention.id}>`, mention.name);
                }
            });
        });

        MusicUtil.ExecuteCustomURL(message, args, musicQueue!);
    }
}