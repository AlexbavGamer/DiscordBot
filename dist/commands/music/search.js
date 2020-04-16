"use strict";
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
const MusicUtil_1 = require("../../domain/util/MusicUtil");
class SearchCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            aliases: ["procurar"],
            guildOnly: true,
            dmOnly: false,
            permLevel: "User",
            name: "search",
            category: "youtube"
        });
    }
    run(message, level, args) {
        const serverQueue = this.client.queue.get(message.guild.id);
        MusicUtil_1.default.Search(message, args, serverQueue);
    }
}
module.exports = SearchCommand;
