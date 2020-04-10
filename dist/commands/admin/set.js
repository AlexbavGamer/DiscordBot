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
class SetConfCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
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
    run(message, level, [action, key, ...value]) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = this.client.settings.get("default");
            const settings = this.client.getSettings(message.guild);
            if (!this.client.settings.has(message.guild.id))
                this.client.settings.set(message.guild.id, {});
            if (action === "edit") {
                if (!key)
                    return message.reply("Please specify a key to edit");
                if (!defaults[key])
                    return message.reply("This key does not exist in the settings");
                const joinedValue = value.join(" ");
                if (joinedValue.length < 1)
                    return message.reply("Please specify a new value");
                if (joinedValue === settings[key])
                    return message.reply("This setting already has that value!");
                settings[key] = value.join(" ");
                this.client.settings.set(message.guild.id, settings);
                message.reply(`${key} successfully edited to ${joinedValue}`);
            }
            else if (action === "del" || action === "reset") {
                if (!key)
                    return message.reply("Please specify a key to reset.");
                if (!defaults[key] && key !== ("all" || "*"))
                    return message.reply("This key does not exist in the settings");
                if (!settings[key] && key !== ("all" || "*"))
                    return message.reply("This key does not have an override and is already using defaults.");
                if (key === ("all" || "*")) {
                    const response = yield this.client.awaitReply(message, `Are you sure you want to reset all to the default value?`);
                    if (["y", "yes"].includes(response.toString())) {
                        Object.entries(settings).forEach(([key, value]) => {
                            settings[key] = defaults[key];
                        });
                        this.client.settings.set(message.guild.id, settings);
                        message.reply(`all settings was successfully reset to default.`);
                    }
                    else if (["n", "no"].includes(response === null || response === void 0 ? void 0 : response.toString())) {
                        message.reply(`Action cancelled.`);
                    }
                    return;
                }
                const response = yield this.client.awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);
                if (["y", "yes"].includes(response === null || response === void 0 ? void 0 : response.toString())) {
                    this.client.settings.delete(message.guild.id, key);
                    message.reply(`${key} was successfully reset to default.`);
                }
                else if (["n", "no"].includes(response === null || response === void 0 ? void 0 : response.toString())) {
                    message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
                }
            }
            else if (action === "get") {
                if (!key)
                    return message.reply("Please specify a key to view");
                if (!defaults[key])
                    return message.reply("This key does not exist in the settings");
                const isDefault = !settings[key] ? "\nThis is the default global default value." : "";
                message.reply(`The value of ${key} is currently ${settings[key]}${isDefault}`);
            }
            else {
                const array = [];
                Object.entries(settings).forEach(([key, value]) => {
                    array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`);
                });
                yield message.channel.send(`= Current Guild Settings =\n${array.join("\n")}`, { code: "asciidoc" });
            }
        });
    }
}
module.exports = SetConfCommand;
