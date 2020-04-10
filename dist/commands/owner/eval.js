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
const discord_js_1 = require("discord.js");
const hastebin_gen_1 = require("hastebin-gen");
class EvalCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "exec",
            category: "owner",
            description: "Evaluates arbitrary javascript.",
            usage: "eval [...code]",
            aliases: ["eval", "evalute"],
            permLevel: "Bot Owner",
            guildOnly: false,
        });
    }
    run(message, level, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = args.join(" ");
            try {
                const evaled = eval(code);
                const clean = yield this.client.clean(evaled);
                if (clean.length >= 2000) {
                    hastebin_gen_1.default(clean, { extension: "txt" }).then(link => {
                        let Embed = new discord_js_1.MessageEmbed()
                            .setDescription(`Because the result has more than 2000 lines, we send the result code to this site: [${link}](Code Here)`)
                            .setTitle("Code Result");
                        message.channel.send(Embed);
                    });
                }
                else {
                    message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
                }
            }
            catch (error) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${yield this.client.clean(error)}\n\`\`\``);
            }
        });
    }
}
module.exports = EvalCommand;
