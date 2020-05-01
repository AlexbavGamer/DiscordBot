import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import { inspect } from "util";
import { Stream } from "stream";
import * as TS from "typescript";
import i18n from "i18n";

class EvalCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
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

    async run(message : Message, level : number, args : Array<string>)
    {
        const code = args.join(" ");
        try
        {
            const result = TS.transpile(code);
            const evaled = eval(result);
            const clean = await this.client.clean(evaled);
            if((<string>clean).length >= 2000)
            {
                let buffer = Buffer.from(<string>clean);
                message.author.send(new MessageAttachment(buffer, "eval.txt", {

                }));
                message.channel.send(`We send the content of the eval to your DM!`);
            }
            else
            {
                message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
            }
        } catch (error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(error)}\n\`\`\``);
        }
    }
}

export default EvalCommand;