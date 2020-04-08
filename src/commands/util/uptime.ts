import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

class UptimeCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "uptime",
            aliases: ["tempoon"],
            category: "util",
            permission: ["SEND_MESSAGES"],
        })
    }

    run(message : Message, ...args : Array<string>)
    {
        message.channel.send(`Estou online há ${this.client.getUptime()}`);
    }
}