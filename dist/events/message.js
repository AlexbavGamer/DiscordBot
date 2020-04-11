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
const MaytrixXEvent_1 = require("../domain/MaytrixXEvent");
class MessageEvent extends MaytrixXEvent_1.MaytrixXEvent {
    constructor(client) {
        super(client);
    }
    run(message) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.isWebSetup)
                return;
            if (message.author.bot)
                return;
            const settings = this.client.getSettings(message.guild);
            const prefixMention = new RegExp(`^<@!?${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id}>( |)$`);
            if (message.content.match(prefixMention)) {
                return message.reply(`Meu prefixo nesse servidor é ${settings.prefix}`);
            }
            if (message.content.indexOf(settings.prefix) !== 0)
                return;
            const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            if (message.guild && !message.member)
                yield message.guild.members.fetch({
                    user: message.author
                });
            const level = this.client.permLevel(message);
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
            if (!cmd)
                return;
            if (cmd && !message.guild && cmd.conf.guildOnly) {
                return message.channel.send(`This command is unavailable via private message. Please run this command in a guild.`);
            }
            if (cmd && message.guild && cmd.conf.dmOnly) {
                return message.channel.send(`This command is via private message. Please run this command in a private.`);
            }
            if (level < this.client.levelCache.get(cmd.conf.permLevel)) {
                if (settings.systemNotice) {
                    return message.channel.send(`You do not have permission to use this command.
                 You permission level is ${level} (${(_b = this.client.config.permLevels.find(l => l.level == level)) === null || _b === void 0 ? void 0 : _b.name}) This command requires level 
                 ${this.client.levelCache.get(cmd.conf.permLevel)} (${cmd.conf.permLevel})`);
                }
                else {
                    return;
                }
            }
            message.flags.toArray().forEach(flag => {
                message.flags.remove(flag);
            });
            let flags = [];
            while (args[0] && args[0][0] === "-") {
                flags.push(args.shift().slice(1));
            }
            if (flags.length == 0) {
                cmd.run(message, level, args);
            }
            else {
                cmd.run(message, level, args, flags);
            }
        });
    }
}
module.exports = MessageEvent;
