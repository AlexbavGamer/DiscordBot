import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { exec, ChildProcess } from "child_process";
import { isUndefined } from "lodash";
class ConsoleCommand extends MaytrixXCommand
{
    shell?: ChildProcess;
    lastExecuted?: string;
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: 'console',
            description: "Execute anything in bot terminal",
            category: 'owner',
            permLevel: "Bot Owner",
        });
    }

    run(message : Message, level : number, args : Array<string>)
    {
        const consoleArgs = args.join(" ");
        if(consoleArgs == "clear")
        {
            this.lastExecuted = "";
            consoleArgs.slice("clear".length);
        }
        try
        {
            if(isUndefined(this.shell))
            {
                this.shell = exec(consoleArgs,{
                    encoding: 'utf8'
                }, (err, stdout, stderr) => {
                    if(err)
                    {
                        return message.channel.send(`Erro: ${err.message}`);
                    }
                    message.channel.send(`Saida: ${stdout}`);
                });
                this.lastExecuted = consoleArgs;
            }
            else
            {
                this.shell = exec(`${this.lastExecuted} && ${consoleArgs}`, {
                    encoding: 'utf8',
                }, (err, stdout, stderr) => {
                    if(err)
                    {
                        return message.channel.send(`Erro: ${err.message}`);
                    }
                    message.channel.send(`Saida: ${stdout}`);
                });
                this.lastExecuted += ` && ${consoleArgs}`;
            }
        }
        catch(e)
        {
            message.channel.send(e);
        }
    }
}

export default ConsoleCommand;