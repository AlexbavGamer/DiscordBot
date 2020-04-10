import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { exec } from "child_process";
class ConsoleCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: 'console',
            description: "Execute anything in bot terminal",
            category: 'owner',
            permLevel: "Bot Owner",
        });
    }

    run(message : Message, level : number, ...args : Array<string>)
    {
        const consoleArgs = args.join(" ");
        try
        {
            exec(consoleArgs,{
                encoding: 'utf8'
            }, (err, stdout, stderr) => {
                if(err)
                {
                    return message.channel.send(`Erro: ${err.message}`);
                }
                message.channel.send(`Saida: ${stdout}`);
            });
        }
        catch(e)
        {
            message.channel.send(e);
        }
    }
}

export = ConsoleCommand;