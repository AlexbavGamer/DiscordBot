import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { inspect } from "util";

class ActivitiesCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "act",
            description: "Manage bot activities",
            category: "owner",
            permLevel: "Bot Owner",
            aliases: ["activitie"]
        });
    }

    async run(message : Message, level : number, args : Array<string>, flags : Array<any>)
    {
        let flag = flags[0];

        switch(flag)
        {
            case "add":
                {
                    let input = args.join(" ");
                    if(input.length == 0) return message.reply(`enter a input`);
                    this.client.addActivitie(input)
                    message.channel.send(`Activitie added: ${input.Truncate(30, "end", "...")}`);
                    break;
                }
            case "remove":
                {
                    let index = parseInt(args[0]);
                    if(index < 0 && index > this.client.config.activities!.length!) return message.reply(`enter a valid index`);
                    let selectedAct = this.client.getActivities()![index];

                    let response = await this.client.awaitReply(message, `Are you sure you want to permanently delete ${selectedAct} from activities?`);

                    if(["y", "yes"].includes(response.toString()))
                    {
                        this.client.removeActivitie(selectedAct);
                        message.channel.send(`Activitie removed: ${selectedAct.Truncate(30, "end", "...")}`);
                    }
                    else if(["n", "no"].includes(response.toString()))
                    {
                        message.channel.send("Action canceled");
                    }
                    break;
                }
            case "list":
                {
                    let output = `= Activities List =\n\n\n`;
                    this.client.getActivities()!.forEach(async (value, index) => {
                        output += `${value} == ${index}\n`;
                    });
                    message.channel.send(output, {code: "asciidoc"});
                    break;
                }
        }
    }
}

export default ActivitiesCommand;