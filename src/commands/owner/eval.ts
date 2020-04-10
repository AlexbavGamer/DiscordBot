import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

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
        try {
            const evaled = eval(code);
            const clean = await this.client.clean(evaled);
            message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
        } catch (error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(error)}\n\`\`\``);
        }
    }
}

export = EvalCommand;