import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { Message } from "discord.js";
import { Collection } from "discord.js";
import { User } from "discord.js";

export default class ClearCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "clear",
            category: "admin",
            permLevel: "Administrator",
            aliases: ["deletar", "limpar"],
            usage: "<limit> @user"
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        if(args.length < 1)
        {
            message.channel.send(`Usage: /${this.conf.name} ${this.conf.usage}`);
            return;
        }
        var AmountToDelete = args[0] != null ? parseInt(args[0]) : 100;
        var UsersMention = message.mentions.users.array();
        var RolesMention = message.mentions.roles.array();
        var messages = (await message.channel.messages.fetch({
            limit: 100,
        })).array().slice(0, AmountToDelete);
        var DeletedMessages : Collection<User, number> = new Collection();
        if (UsersMention.length == 0 && RolesMention.length == 0)
        {
            await Promise.all(messages.map(async message => {
                let user = message.author;
                if(!DeletedMessages.has(user))
                {
                    DeletedMessages.set(user, 0);
                }
                if(message.deletable)
                {
                    if(DeletedMessages.has(user))
                    {
                        DeletedMessages.set(user, DeletedMessages.get(user)! + 1);
                    }
                    await message.delete();
                }
            })).then(async => 
            {
                DeletedMessages.forEach(async (deleted, user) => {
                    (await message!.reply(`Foram deletadas ${deleted} mensagems de <@${user.id}> com sucesso.`)).delete({
                        timeout: 5000
                    });
                });
            });;
        }
        else
        {
            if(UsersMention)
            {
                UsersMention.forEach(async user => {
                    DeletedMessages.set(user, 0);
                    await Promise.all(messages.map(async message => {
                        if(message.deletable && message.author.id == user.id)
                        {
                            DeletedMessages.set(user, DeletedMessages.get(user)! + 1);
                            await message.delete();
                        }
                    })).then(async () => {
                        (await message!.reply(`Foram deletadas ${DeletedMessages.get(user)!} mensagems de <@${user.id}> com sucesso.`)).delete({
                            timeout: 5000
                        });
                    });
                });
            }
            if(RolesMention)
            {
                RolesMention.forEach(async role => {
                    var users = role.members.array().map(member => member.user);
                    users.forEach(async user => {
                        DeletedMessages.set(user, 0);
                        await Promise.all(messages.map(async message => {
                            if(message.deletable && message.author.id == user.id)
                            {
                                DeletedMessages.set(user, DeletedMessages.get(user)! + 1);
                                await message.delete();
                            }
                        })).then(async () => {
                            (await message!.reply(`Foram deletadas ${DeletedMessages.get(user)!} mensagems de <@&${role.id}> com sucesso.`)).delete({
                                timeout: 5000
                            });
                        });
                    });
                });
            }
        }
    }
}