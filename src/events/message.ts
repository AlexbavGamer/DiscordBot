import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { Message } from "discord.js";
import { MaytrixXCommand } from "../domain/MaytrixXCommand";

class MessageEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    run(message : Message)
    {
        if(!message.content.startsWith(this.client.config.prefix)) return;
        if(message.author.bot) return;

        const args : Array<string> = message.content.slice(this.client.config.prefix.length).trim().split(/ +/g);
        const cmd : string = args.shift()!.toLowerCase();
        
        let command : MaytrixXCommand;

        if(cmd.length == 0) return;

        if(this.client.commands.has(cmd))
        {
            command = this.client.commands.get(cmd)!;
        }

        if(command!)
        {
            if(command!.conf.permission)
            {
                if(message.member!.hasPermission(command!.conf.permission))
                {
                    command!.run(message, ...args);
                }
            }

            else if(command!.conf.ownerOnly)
            {
                let isOwner = (message.author.id == this.client.config.ownerId);

                if(isOwner)
                {
                    command!.run(message, ...args);
                }
            }
    
            else if(command! && message.member!.hasPermission(command!.conf.permission))
            {
                command!.run(message, ...args);
            }
        }
        else
        {
            message.channel.send("comando invalido!");
        }
    }
}

export = MessageEvent;