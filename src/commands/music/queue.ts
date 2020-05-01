import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";

export default class extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "queue",
            category: "youtube",
            aliases: ["fila"],
            permLevel: "User",
        });
    }

    
    run(message: Message, level: number, flags: string[], ...args: string[]): void {
        const serverQueue = this.client.queue.get(message.guild!.id);

        if(serverQueue!.songs.length > 0)
        {
            let songs = "";

            serverQueue?.songs.forEach(song => {
                songs += `**[${serverQueue?.songs.indexOf(song)+1}]**: ${song.title}`;
            });

            message.channel.send(songs, {
                code: 'asciidoc'
            });
        }
        else
        {
            message.channel.send("não há musicas em fila.");
        }
    }
}