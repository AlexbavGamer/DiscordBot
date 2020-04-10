"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const discord_js_1 = require("discord.js");
const load = (client) => {
    const cmds = new discord_js_1.Collection();
    const commandFolders = fs_1.readdirSync(`${__dirname}/../commands/`);
    commandFolders.forEach((folder) => {
        const commandFiles = fs_1.readdirSync(`${__dirname}/../commands/${folder}/`).filter((c) => c.endsWith(".js"));
        for (let file of commandFiles) {
            const filePath = path.resolve(`${__dirname}/../commands/${folder}/${file}`);
            const pull = require(filePath);
            const cmd = new pull(client);
            cmds.set(cmd.conf.name, cmd);
            delete require.cache[filePath];
        }
    });
    return cmds;
};
exports.load = load;
