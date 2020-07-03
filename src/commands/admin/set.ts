import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { inspect } from "util";

class SetConfCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "set",
            usage: "set <view/get/edit> <key> <value>",
            aliases: ["setting", "settings"],
            description: "View or change settings for your server.",
            category: "admin",
            permLevel: "Administrator",
            guildOnly: true,
        });
    }

    async run(message : Message, level : number, [action, key, ...value] : [string, string, string[]])
    {
        const defaults = this.client.settings.get("default");
        const settings = this.client.getSettings(message.guild!) as any;
        if(!this.client.settings.has(message.guild!.id)) this.client.settings.set(message.guild!.id, {});

        if(action === "edit")
        {
            if (!key) return message.reply(message.translateGuildText("conf_key_edit"));
            if (!defaults[key]) return message.reply(message.translateGuildText("conf_key_not_exist"));
            const joinedValue = value.join(" ");
            if (joinedValue.length < 1) return message.reply(message.translateGuildText("conf_key_set"));
            if (joinedValue === settings[key]) return message.reply(message.translateGuildText("conf_already_key_set"));

            settings[key] = value.join(" ");

            this.client.settings.set(message.guild!.id, settings);

            message.reply(message.translateGuildText("conf_edited", key, joinedValue));
        }
        else if(action === "del" || action === "reset")
        {
            if (!key) return message.reply(message.translateGuildText("conf_reset_key"));
            if (!defaults[key] && key !== ("all" || "*")) return message.reply(message.translateGuildText("conf_key_not_exist"));
            if (!settings[key] && key !== ("all" || "*")) return message.reply(message.translateGuildText("conf_key_cant_override"));

            let y = message.translateGuildText("y");
            let yes = message.translateGuildText("yes");

            let n = message.translateGuildText("n");
            let no = message.translateGuildText("no");
            if(key === ("all" || "*"))
            {
                const response = await this.client.awaitReply(message, message.translateGuildText("conf_key_ask_reset"));

                if([y, yes].includes(response.toString()))
                {
                    Object.entries(settings).forEach(([key, value]) =>
                    {
                        settings[key] = defaults[key];
                    });
                    this.client.settings.set(message.guild!.id, settings);
                    message.reply(message.translateGuildText("conf_key_reseted"));
                }
                else if([n, no].includes(response!.toString()))
                {
                    message.reply(message.translateGuildText("action_cancelled"));
                }
                return;
            }
            const response = await this.client.awaitReply(message, message.translateGuildText("conf_key_ask_reset_key", key));

            if([y, yes].includes(response!.toString()))
            {
                this.client.settings.delete(message.guild!.id, key);
                message.reply(message.translateGuildText("conf_key_reseted_key", key));
            }
            else if([n,no].includes(response!.toString()))
            {
                message.reply(message.translateGuildText("conf_key_no_reseted", key, settings[key]))
            }
        }
        else if(action === "get")
        {
            if (!key) return message.reply(message.translateGuildText("conf_key_get"));
            if (!defaults[key]) return message.reply(message.translateGuildText("conf_key_not_exist"));
            const isDefault = !settings[key] ? message.translateGuildText("conf_key_global_value") : "";
            message.reply(message.translateGuildText("conf_key_get_value", key, settings[key], isDefault));
        }
        else{
            const array : any = [];
            Object.entries(settings).forEach(([key, value]) =>
            {
                array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`);
            });
            await message.channel.send(`= ${message.translateGuildText("default_settings_server", message.guild?.name)} =\n${array.join("\n")}`, {code: "asciidoc"});
        }
    }
}

export default SetConfCommand;