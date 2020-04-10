"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
const util_1 = require("util");
class GlobalConfCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
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
    run(message, level, [action, key, ...values]) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = this.client.settings.get("default");
            const value = values.join(" ");
            if (action === "add") {
                if (!key)
                    return message.reply(`Please specify a key to add`);
                if (defaults[key])
                    return message.reply(`This key already exists in the default settings`);
                if (value.length < 1)
                    return message.reply("Please specify a value");
                defaults[key] = value;
                this.client.settings.set("default", defaults);
                message.reply(`${key} successfully added with the value of ${value}`);
            }
            else if (action === "edit") {
                if (!key)
                    return message.reply("Please specify a key to edit");
                if (!defaults[key])
                    return message.reply("This key does not exist in the settings");
                if (value.length < 1)
                    return message.reply("Please specify a new value");
                defaults[key] = value;
                this.client.settings.set("default", defaults);
                message.reply(`${key} successfully edited to ${value}`);
            }
            else if (action === "del") {
                if (!key)
                    return message.reply("Please specify a key to delete.");
                if (!defaults[key])
                    return message.reply("This key does not exist in the settings");
                const response = yield this.client.awaitReply(message, `Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`);
                if (["y", "yes"].includes(response === null || response === void 0 ? void 0 : response.toString())) {
                    delete defaults[key];
                    this.client.settings.set("default", defaults);
                    for (const [guildid, conf] of this.client.settings.filter((setting, id) => setting[key] && id !== "default")) {
                        delete conf[key];
                        this.client.settings.set(guildid, conf);
                    }
                    message.reply(`${key} was successfully deleted.`);
                    message.delete();
                }
                else if (["n", "no"].includes(response === null || response === void 0 ? void 0 : response.valueOf())) {
                    message.reply(`Action cancelled.`);
                    message.delete();
                }
            }
            else if (action === "get") {
                if (!key)
                    return message.reply("Please specify a key to view");
                if (!defaults[key])
                    return message.reply("This key does not exist in the settings");
                message.reply(`The value of ${key} is currently ${defaults[key]}`);
            }
            else {
                yield message.channel.send(`***__Bot Default Settings__***\n\`\`\`json\n${util_1.inspect(defaults)}\n\`\`\``);
            }
        });
    }
}
module.exports = GlobalConfCommand;
