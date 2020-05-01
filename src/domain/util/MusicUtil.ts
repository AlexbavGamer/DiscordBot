import { VoiceConnection, Message, MessageEmbed, VoiceChannel, TextChannel, Guild, MessageCollector } from "discord.js";
import ytdl from "ytdl-core";
import searchYoutube from "yt-search";
import { MusicQueue } from "../MaytrixXClient";
import { sounds } from "soundoftext-js";
export default
{
    async ExecuteSearch(url : string, message : Message, serverQueue : any)
    {
        const voiceChannel = message.member!.voice.channel;

        if(!voiceChannel)
        {
            return message.channel.send(`You need to be in voice channel to play music!`);
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(`I need the permissions to join and speak in your voice channel!`);
        }

        const songInfo = await ytdl.getInfo(`${url}`);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
            description: songInfo.description,
            thumbnail: songInfo.thumbnail_url,
        };

        if(!serverQueue)
        {
            const queueContruct = <{
                textChannel : TextChannel,
                voiceChannel : VoiceChannel,
                connection: VoiceConnection | null,
                songs: Array<{
                    title: string;
                    url: string;
                    description: string;
                    thumbnail: string;
                }>,
                volume: number,
                playing: boolean
            }>{
                textChannel : message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            global.bot.queue.set(message.guild!.id, queueContruct);

            queueContruct.songs.push(song);

            try
            {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.Play(message.guild!, queueContruct.songs[0]);
            }
            catch(err)
            {
                console.log(err);
                global.bot.queue.delete(message.guild!.id);
                return message.channel.send(err);
            }
        }
        else
        {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to queue!`);
        }
    },
    async ExecuteCustomURL(message : Message, args : Array<string>, serverQueue: MusicQueue)
    {


        const voiceChannel = message.member!.voice.channel;

        if(!voiceChannel)
        {
            return message.channel.send(`You need to be in voice channel to play music!`);
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(`I need the permissions to join and speak in your voice channel!`);
        }

        let url = await sounds.create({text: args.join(" "), voice: 'pt-BR'});

        let song = <{
            title: string;
            url: string;
            description: string;
            thumbnail : string;
        }>{
            title: args.join(" "),
            url: url,
            description: "Made by [Sound of Text](https://soundoftext.com)",
            thumbnail: ""
        };

        if(!serverQueue)
        {
            const queueContruct = <{
                textChannel : TextChannel,
                voiceChannel : VoiceChannel,
                connection: VoiceConnection | null,
                songs: Array<{
                    title: string;
                    url: string;
                    description: string;
                    thumbnail: string;
                }>,
                volume: number,
                playing: boolean
            }>{
                textChannel : message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            global.bot.queue.set(message.guild!.id, queueContruct);

            queueContruct.songs.push(song);

            try
            {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.PlayURL(message.guild!, queueContruct.songs[0]);
            }
            catch(err)
            {
                console.log(err);
                global.bot.queue.delete(message.guild!.id);
                return message.channel.send(err);
            }
        }
        else
        {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to queue!`);
        }
    },
    async Execute(message : Message, serverQueue : MusicQueue)
    {
        const args = message.content.split(" ");

        const voiceChannel = message.member!.voice.channel;

        if(!voiceChannel)
        {
            return message.channel.send(`You need to be in voice channel to play music!`);
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(`I need the permissions to join and speak in your voice channel!`);
        }

        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
            description: songInfo.description,
            thumbnail: songInfo.thumbnail_url,
        };

        if(!serverQueue)
        {
            const queueContruct = <{
                textChannel : TextChannel,
                voiceChannel : VoiceChannel,
                connection: VoiceConnection | null,
                songs: Array<{
                    title: string;
                    url: string;
                    description: string;
                    thumbnail: string;
                }>,
                volume: number,
                playing: boolean
            }>{
                textChannel : message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            global.bot.queue.set(message.guild!.id, queueContruct);

            queueContruct.songs.push(song);

            try
            {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.Play(message.guild!, queueContruct.songs[0]);
            }
            catch(err)
            {
                console.log(err);
                global.bot.queue.delete(message.guild!.id);
                return message.channel.send(err);
            }
        }
        else
        {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to queue!`);
        }
    },
    PlayURL(guild : Guild, song : { title : string, url : string, description: string, thumbnail : string })
    {
        let serverQueue = global.bot.queue.get(guild.id) as MusicQueue;

        if(!song)
        {
            serverQueue.voiceChannel.leave();
            global.bot.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection!.play(song.url).on("finish", () => {
            serverQueue.songs.shift();
            this.PlayURL(guild, serverQueue.songs[0]);
        });
        dispatcher!.setVolumeLogarithmic(serverQueue.volume / 5);
        let embed = new MessageEmbed();
        let description = `Start Playing: ${song.title}\n` +
            `Description: \n\t${song.description}\n`;

        embed.setDescription(description);

        serverQueue.textChannel.send(embed);
    },
    Play(guild : Guild, song : { title : string, url : string, description: string, thumbnail : string })
    {
        const serverQueue = global.bot.queue.get(guild.id) as MusicQueue;
        if(!song)
        {
            serverQueue.voiceChannel.leave();
            global.bot.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection!.play(ytdl(song.url)).on('finish', () => {
            serverQueue.songs.shift();
            this.Play(guild, serverQueue.songs[0]);
        });
        dispatcher!.setVolumeLogarithmic(serverQueue.volume / 5);
        let embed = new MessageEmbed();
        let description = `Start Playing: ${song.title}\n` +
            `Description: \n\`\`\`${song.description}\`\`\`\n`;

        embed.setDescription(description);
        embed.setThumbnail(song.thumbnail);
        serverQueue.textChannel.send(embed);
    },
    Stop(message : Message, serverQueue : MusicQueue)
    {
        if(!message.member!.voice.channel)
        {
            return message.channel.send(
                "You have to be in voice channel to stop the music!"
            );
        }

        serverQueue.songs = [];
        serverQueue.connection!.dispatcher.end();
    },
    Skip(message : Message, serverQueue : MusicQueue)
    {
        if (!message.member!.voice.channel)
        {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if(!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        serverQueue.connection!.dispatcher.end();
    },
    Search(message : Message, args : string[], serverQueue : MusicQueue)
    {
        if (!message.member!.voice.channel)
        {
            return message.channel.send(
                "You have to be in a voice channel to search the music!"
            );
        }

        searchYoutube(args.join(" "),(err, data) => {
            if(err) return console.log(err);

            let resp = '';
            const videos = data.videos.slice(0, 9);

            videos.forEach((_, i) => {
                resp += `**[${(i + 1)}]:** \`${videos[i].title}\`\n`;
            });

            resp += `\n**Choose a number btween \`1-${videos.length}\`**`;

            message.channel.send(resp);

            const filter = (m : Message) => !isNaN(parseInt(m.content)) && parseInt(m.content) < videos.length+1 && parseInt(m.content) > 0;
            const collector = message.channel.createMessageCollector(filter) as MessageCollector & {
                videos : searchYoutube.VideoSearchResult[]
            };

            collector.videos = videos;

            collector.once('collect', (m : Message) =>
            {
                let video = videos[parseInt(m.content)-1];

                this.ExecuteSearch(video.url, m, serverQueue);
            });
        });
    }
}