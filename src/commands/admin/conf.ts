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
            aliases: ["config"],
            category: "admin",
            permLevel: "Bot Owner",
        });
    }

    async run(message : Message, level : number, [action, key, ...values] : [string, string, string[]])
    {
        const defaults = this.client.settings.get("default");

        const value = values.join(" ");

        if(action === "add")
        {
            if(!key) return message.reply(`Please specify a key to add`);
            if(defaults[key]) return message.reply(`This key already exists in the default settings`);
            if(value.length < 1) return message.reply("Please specify a value");

            defaults[key] = value;

            this.client.settings.set("default", defaults);
            message.reply(`${key} successfully added with the value of ${value}`);
        }
        else if(action === "edit")
        {
            if (!key) return message.reply("Please specify a key to edit");
            if (!defaults[key]) return message.reply("This key does not exist in the settings");
            if (value.length < 1) return message.reply("Please specify a new value");


            defaults[key] = value;

            this.client.settings.set("default", defaults);
            message.reply(`${key} successfully edited to ${value}`);
        }
        else if(action === "del")
        {
            if (!key) return message.reply("Please specify a key to delete.");
            if (!defaults[key]) return message.reply("This key does not exist in the settings");

            const response = await this.client.awaitReply(message,  `Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`);
            
            if(["y", "yes"].includes(<string>response?.valueOf()))
            {
                delete defaults[key];
                this.client.settings.set("default", defaults);

                for (const [guildid, conf] of this.client.settings.filter((setting, id) => setting[key!] && id !== "default")) {
                    delete conf[key];
                    this.client.settings.set(guildid, conf);
                }

                message.reply(`${key} was successfully deleted.`);
                message.delete();
            }
            else if(["n", "no"].includes(<string>response?.valueOf()))
            {
                message.reply(`Action cancelled.`);
                message.delete();
            }
        }
        else if(action === "get")
        {
            if (!key) return message.reply("Please specify a key to view");
            if (!defaults[key]) return message.reply("This key does not exist in the settings");
            message.reply(`The value of ${key} is currently ${defaults[key]}`);
        }
        else
        {
            await message.channel.send(`***__Bot Default Settings__***\n\`\`\`json\n${inspect(defaults)}\n\`\`\``);
        }
    }
}

export = GlobalConfCommand