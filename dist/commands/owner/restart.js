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
const child_process_1 = require("child_process");
class RestartCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "restart",
            description: "restart the bot",
            category: "owner",
            permLevel: "Bot Admin"
        });
    }
    run(message, level, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            message.reply(`Getting last project version: `);
            child_process_1.exec("chmod 777 ./git.sh && ./git.sh && refresh", (err, out) => {
                console.log(out);
                message.reply(out);
            });
        });
    }
}
module.exports = RestartCommand;
