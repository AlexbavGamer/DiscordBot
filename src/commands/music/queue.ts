import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message, Collection, MessageEmbed } from "discord.js";

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
        const serverQueue = this.client.queue.get(message.guild?.id!);
        if((serverQueue?.connection) && serverQueue?.songs!.length > 0)
        {
            let songs : Collection<number, string> = new Collection();

            let embed = new MessageEmbed();

            serverQueue.songs.forEach((song, index) => {
                songs.set(index, song.title);
            });

            embed.setTitle(`Songs Queue`);

            embed.setDescription(`List of Songs`);

            songs.forEach((song, index) => {
                embed.addField(index.toString(), song, true);
            });

            message.channel.send(embed);
        }
        else
        {
            message.channel.send(this.client.translateGuildText(message.guild!, "no_songs_on_queue", message.author!.username));
        }
    }
}