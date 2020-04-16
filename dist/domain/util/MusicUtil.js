"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ytdl = require("ytdl-core");
const searchYoutube = require("yt-search");
exports.default = {
    ExecuteSearch(url, message, serverQueue) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            if (!voiceChannel) {
                return message.channel.send(`You need to be in voice channel to play music!`);
            }
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!(permissions === null || permissions === void 0 ? void 0 : permissions.has("CONNECT")) || !(permissions === null || permissions === void 0 ? void 0 : permissions.has("SPEAK"))) {
                return message.channel.send(`I need the permissions to join and speak in your voice channel!`);
            }
            const songInfo = yield ytdl.getInfo(`${url}`);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
                description: songInfo.description,
                thumbnail: songInfo.thumbnail_url,
            };
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };
                global.bot.queue.set((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id, queueContruct);
                queueContruct.songs.push(song);
                try {
                    var connection = yield voiceChannel.join();
                    queueContruct.connection = connection;
                    this.Play(message.guild, queueContruct.songs[0]);
                }
                catch (err) {
                    console.log(err);
                    global.bot.queue.delete((_c = message.guild) === null || _c === void 0 ? void 0 : _c.id);
                    return message.channel.send(err);
                }
            }
            else {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} has been added to queue!`);
            }
        });
    },
    Execute(message, serverQueue) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const args = message.content.split(" ");
            const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            if (!voiceChannel) {
                return message.channel.send(`You need to be in voice channel to play music!`);
            }
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!(permissions === null || permissions === void 0 ? void 0 : permissions.has("CONNECT")) || !(permissions === null || permissions === void 0 ? void 0 : permissions.has("SPEAK"))) {
                return message.channel.send(`I need the permissions to join and speak in your voice channel!`);
            }
            const songInfo = yield ytdl.getInfo(args[1]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
                description: songInfo.description,
                thumbnail: songInfo.thumbnail_url,
            };
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };
                global.bot.queue.set((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id, queueContruct);
                queueContruct.songs.push(song);
                try {
                    var connection = yield voiceChannel.join();
                    queueContruct.connection = connection;
                    this.Play(message.guild, queueContruct.songs[0]);
                }
                catch (err) {
                    console.log(err);
                    global.bot.queue.delete((_c = message.guild) === null || _c === void 0 ? void 0 : _c.id);
                    return message.channel.send(err);
                }
            }
            else {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} has been added to queue!`);
            }
        });
    },
    Play(guild, song) {
        var _a;
        const serverQueue = global.bot.queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            global.bot.queue.delete(guild.id);
            return;
        }
        const dispatcher = (_a = serverQueue.connection) === null || _a === void 0 ? void 0 : _a.play(ytdl(song.url)).on('finish', () => {
            serverQueue.songs.shift();
            this.Play(guild, serverQueue.songs[0]);
        });
        dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        let embed = new discord_js_1.MessageEmbed();
        let description = `Start Playing: ${song.title}\n` +
            `Description: \n\`\`\`${song.description}\`\`\`\n`;
        embed.setDescription(description);
        embed.setThumbnail(song.thumbnail);
        serverQueue.textChannel.send(embed);
    },
    Stop(message, serverQueue) {
        var _a, _b;
        if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
            return message.channel.send("You have to be in voice channel to stop the music!");
        }
        serverQueue.songs = [];
        (_b = serverQueue.connection) === null || _b === void 0 ? void 0 : _b.dispatcher.end();
    },
    Skip(message, serverQueue) {
        var _a, _b;
        if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
            return message.channel.send("You have to be in a voice channel to stop the music!");
        }
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        (_b = serverQueue.connection) === null || _b === void 0 ? void 0 : _b.dispatcher.end();
    },
    Search(message, args, serverQueue) {
        var _a;
        if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
            return message.channel.send("You have to be in a voice channel to search the music!");
        }
        searchYoutube(args.join(" "), (err, data) => {
            if (err)
                return console.log(err);
            let resp = '';
            const videos = data.videos.slice(0, 9);
            videos.forEach((video, i) => {
                resp += `**[${(i + 1)}]:** \`${videos[i].title}\`\n`;
            });
            resp += `\n**Choose a number btween \`1-${videos.length}\`**`;
            message.channel.send(resp);
            const filter = (m) => !isNaN(parseInt(m.content)) && parseInt(m.content) < videos.length + 1 && parseInt(m.content) > 0;
            const collector = message.channel.createMessageCollector(filter);
            collector.videos = videos;
            collector.once('collect', (m) => {
                let video = videos[parseInt(m.content) - 1];
                this.ExecuteSearch(video.url, m, serverQueue);
            });
        });
    }
};
