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
const MusicUtil_1 = require("../../domain/util/MusicUtil");
class StopCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            aliases: ["parar"],
            guildOnly: true,
            dmOnly: false,
            permLevel: "User",
            name: "stop",
            category: "youtube"
        });
    }
    run(message, level, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverQueue = this.client.queue.get(message.guild.id);
            MusicUtil_1.default.Stop(message, serverQueue);
        });
    }
}
module.exports = StopCommand;
