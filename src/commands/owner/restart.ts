import { MaytrixXCommand } from "../../domain/MaytrixXCommand"
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

class RestartCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "restart",
            category: "owner",
            permLevel: "Bot Owner"
        });
    }

    run(message : Message, level : number, ...args : Array<string>)
    {
        message.channel.send("Bot reiniciando! ...").then((m) => {
            setTimeout(() => {
                m.edit("Bot reiniciando! ..");

                setTimeout(() => {
                    m.edit("Bot reiniciando! .");

                    setTimeout(() => {
                        m.edit("Bot reiniciado com sucesso!").then(m => m.delete({ timeout: 1000 }));

                        this.client.restart();
                    }, 1000);
                }, 1000);
            }, 1000);
        });
    }
}

export = RestartCommand;