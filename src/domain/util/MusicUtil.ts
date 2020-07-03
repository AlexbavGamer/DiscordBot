import { VoiceConnection, Message, MessageEmbed, VoiceChannel, TextChannel, Guild, MessageCollector, VolumeInterface } from "discord.js";
import ytdl from "ytdl-core";
import searchYoutube from "yt-search";
import { MusicQueue, MaytrixXClient } from "../MaytrixXClient";
const { sounds } = require("soundoftext-js");
export default
{
    async ExecuteSearch(url : string, message : Message, serverQueue : any)
    {
        const voiceChannel = message.member!.voice.channel;

        if(!voiceChannel)
        {
            return message.channel.send(message.translateGuildText("play_user_no_channel"));
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(message.translateGuildText("play_no_permission"));
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
            const queueContruct = <MusicQueue>{
                textChannel : message.channel,
                voiceChannel: voiceChannel,
                dispatcher: null,
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
            return message.channel.send(message.translateGuildText("play_user_no_channel"));
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(message.translateGuildText("play_no_permission"));
        }

        let url = await sounds.create({text: args.join(" "), voice: message.guild?.getLanguageByRegion()});

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
            const queueContruct = <MusicQueue>{
                textChannel : message.channel,
                voiceChannel: voiceChannel,
                dispatcher: null,
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
                this.PlayURL(message, message.guild!, queueContruct.songs[0]);
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
            return message.channel.send(message.translateGuildText("music_added_queue", song.title));
        }
    },
    async Volume(message : Message, args : Array<string>, serverQueue : MusicQueue)
    {
        const voiceChannel = message.member!.voice.channel;

        if(!voiceChannel)
        {
            return message.channel.send(message.translateGuildText("play_user_no_channel"));
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(message.translateGuildText("play_no_permission"));
        }
        if(serverQueue.dispatcher && serverQueue.voiceChannel)
        {
            if(args.length == 0)
            {
                message.channel.send(message.translateGuildText("current_volume", serverQueue.dispatcher.volume));
            }
            else
            {
                let currentVolume = serverQueue.dispatcher.volume;
                
                let volume = parseInt(args[0]);

                if(currentVolume == volume) return;
                
                if((volume / 100) > 0)
                {
                    volume /= 100;
                }

                if(volume >= 1) 
                {
                    message.channel.send(message.translateGuildText("volume_reached_limit", volume, serverQueue.dispatcher.volume));
                    volume = 1;
                }
                serverQueue.dispatcher.setVolumeLogarithmic(volume);
            }
        }
        
    },
    async Execute(message : Message, serverQueue : MusicQueue)
    {
        const args = message.content.split(" ");

        const voiceChannel = message.member!.voice.channel;

        if(!voiceChannel)
        {
            return message.channel.send(message.translateGuildText("play_user_no_channel"));
        }
        const permissions = voiceChannel.permissionsFor(message!.client!.user!);
        if(!permissions!.has("CONNECT") || !permissions!.has("SPEAK"))
        {
            return message.channel.send(message.translateGuildText("play_no_permission"));
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
            const queueContruct = <MusicQueue>
            {
                textChannel : message.channel,
                voiceChannel: voiceChannel,
                dispatcher: null,
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
            return message.channel.send(message.translateGuildText("music_added_queue", song.title));
        }
    },
    PlayURL(message : Message, guild : Guild, song : { title : string, url : string, description: string, thumbnail : string })
    {
        let serverQueue = global.bot.queue.get(guild.id) as MusicQueue;

        if(!song)
        {
            serverQueue.voiceChannel.leave();
            global.bot.queue.delete(guild.id);
            return;
        }

        serverQueue.dispatcher = serverQueue.connection!.play(song.url).on("finish", () => {
            serverQueue.songs.shift();
            this.PlayURL(message, guild, serverQueue.songs[0]);
        });
        serverQueue.dispatcher!.setVolumeLogarithmic(serverQueue.volume / 5);
        let embed = new MessageEmbed();
        
        let description = `${message.translateGuildText("music_start_playing", song.title)}\n` +
        message.translateGuildText("music_description", song.description);


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

        serverQueue.dispatcher = serverQueue.connection!.play(ytdl(song.url)).on('finish', () => {
            serverQueue.songs.shift();
            this.Play(guild, serverQueue.songs[0]);
        });
        serverQueue.dispatcher!.setVolumeLogarithmic(serverQueue.volume / 5);
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
        serverQueue.playing = false;
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
            const videos = data.videos.slice(0, 10);
            console.log(videos.length);
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