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
class ActivitiesCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "act",
            description: "Manage bot activities",
            category: "owner",
            permLevel: "Bot Owner",
            aliases: ["activitie"]
        });
    }
    run(message, level, args, flags) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let flag = flags[0];
            console.log(util_1.inspect(args));
            switch (flag) {
                case "add":
                    {
                        let input = args.join(" ");
                        if (input.length == 0)
                            return message.reply(`enter a input`);
                        (_a = this.client.config.activities) === null || _a === void 0 ? void 0 : _a.push(input);
                        message.channel.send(`Activitie added: ${input.Truncate(30, "end", "...")}`);
                        break;
                    }
                case "remove":
                    {
                        let index = parseInt(args[0]);
                        if (index !== -1)
                            return message.reply(`enter a index`);
                        let selectedAct = this.client.config.activities[index];
                        let response = yield this.client.awaitReply(message, `Are you sure you want to permanently delete ${selectedAct} from activities?`);
                        if (["y", "yes"].includes(response.toString())) {
                            delete this.client.config.activities[index];
                            message.channel.send(`Activitie removed: ${selectedAct.Truncate(30, "end", "...")}`);
                        }
                        else if (["n", "no"].includes(response.toString())) {
                            message.channel.send("Action canceled");
                        }
                        break;
                    }
                case "list":
                    {
                        let output = `= Activities List =\n\n\n`;
                        (_b = this.client.config.activities) === null || _b === void 0 ? void 0 : _b.forEach((value, index) => __awaiter(this, void 0, void 0, function* () {
                            output += `${value} == ${index}\n`;
                        }));
                        message.channel.send(output, { code: "asciidoc" });
                        break;
                    }
            }
        });
    }
}
module.exports = ActivitiesCommand;
