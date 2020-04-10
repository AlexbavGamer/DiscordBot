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
class MyLevelCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "mylevel",
            description: "Tells you your permission level for the current message location.",
            category: "Miscellaneous",
            permLevel: "User",
            guildOnly: true,
        });
    }
    run(message, level, args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const friendly = (_a = this.client.config.permLevels.find(l => l.level == level)) === null || _a === void 0 ? void 0 : _a.name;
            message.reply(`Your permission level is: ${level} - ${friendly}`);
        });
    }
}
module.exports = MyLevelCommand;