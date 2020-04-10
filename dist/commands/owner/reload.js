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
Object.defineProperty(exports, "__esModule", { value: true });
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
class ReloadCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            guildOnly: false,
            aliases: [],
            permLevel: "Bot Admin",
            name: "reload",
            category: "System",
            description: "Reloads a command that\"s been modified."
        });
    }
    run(message, level, [commandName, ...values]) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!commandName)
                return message.reply("Must provide a command to reload. Derp.");
            let response = yield this.client.unloadCommand(commandName);
            if (response)
                return message.reply(`Error Unloading: ${response}`);
            response = this.client.loadCommand(commandName);
            if (response)
                return message.reply(`Error Loading: ${response}`);
            message.reply(`The command \`${commandName}\` has been reloaded`);
        });
    }
}
