import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { inspect } from "util";

class GlobalConfCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "conf",
            usage: "conf <view/get/edit> <key> <value>",
            aliases: ["config"],
            description: "Modify the default configuration for all guilds.",
            category: "admin",
            permLevel: "Bot Owner",
            guildOnly: true,
        });
    }

    async run(message : Message, level : number, [action, key, ...values] : [string, string, string[]])
    {
        const defaults = this.client.settings.get("default");

        const value = values.join(" ");

        if(action === "add")
        {
            if(!key) return message.reply(message.translateGuildText("conf_key_add"));
            if(defaults[key]) return message.reply(message.translateGuildText("conf_already_key"));
            if(value.length < 1) return message.reply(message.translateGuildText("conf_need_value"));

            defaults[key] = value;

            this.client.settings.set("default", defaults);
            message.reply(message.translateGuildText("conf_setted", key, value));
        }
        else if(action === "edit")
        {
            if (!key) return message.reply(message.translateGuildText("conf_key_edit"));
            if (!defaults[key]) return message.reply(message.translateGuildText("conf_key_not_exist"));
            if (value.length < 1) return message.reply(message.translateGuildText("conf_need_value"));


            defaults[key] = value;

            this.client.settings.set("default", defaults);
            message.reply(message.translateGuildText("conf_edited", key, value));
        }
        else if(action === "del")
        {
            if (!key) return message.reply(message.translateGuildText("conf_key_delete"));
            if (!defaults[key]) return message.reply(message.translateGuildText("conf_key_not_exist"));

            const response = await this.client.awaitReply(message,  message.translateGuildText("conf_key_ask_delete", key));

            let y = message.translateGuildText("y");
            let yes = message.translateGuildText("yes");

            let n = message.translateGuildText("n");
            let no = message.translateGuildText("no");
            if([y, yes].includes(response!.toString()))
            {
                delete defaults[key];
                this.client.settings.set("default", defaults);

                for (const [guildid, conf] of this.client.settings.filter((setting, id) => setting[key!] && id !== "default")) {
                    delete conf[key];
                    this.client.settings.set(guildid, conf);
                }

                message.reply(message.translateGuildText("conf_deleted", key));
                message.delete();
            }
            else if([n, no].includes(<string>response!.valueOf()))
            {
                message.reply(message.translateGuildText("action_cancelled"));
                message.delete();
            }
        }
        else if(action === "get")
        {
            if (!key) return message.reply(message.translateGuildText("conf_key_get"));
            if (!defaults[key]) return message.reply(message.translateGuildText("conf_key_not_exist"));
            message.reply(`The value of ${key} is currently ${defaults[key]}`);
        }
        else
        {
            await message.channel.send(`***__${message.translateGuildText("default_settings")}__***\n\`\`\`json\n${inspect(defaults)}\n\`\`\``);
        }
    }
}

export default GlobalConfCommand;