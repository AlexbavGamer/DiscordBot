import { MaytrixXClient } from "./MaytrixXClient";
import { readdirSync } from "fs";
import { MaytrixXCommand } from "./MaytrixXCommand";
import path = require("path");
import { Collection } from "discord.js";

const load = (client : MaytrixXClient) : Collection<string, MaytrixXCommand> => {
    const cmds: Collection<string, MaytrixXCommand> = new Collection();

    const commandFolders : Array<string> = readdirSync(`${__dirname}/../commands/`);

    commandFolders.forEach((folder : string) => {
        const commandFiles : Array<string> = readdirSync(`${__dirname}/../commands/${folder}/`).filter((c: string) => c.endsWith(".js"));

        for(let file of commandFiles)
        {
            const filePath = path.resolve(`${__dirname}/../commands/${folder}/${file}`);
            const pull = require(filePath);
            const cmd = new pull(client) as MaytrixXCommand;

            cmds.set(cmd.conf.name, cmd);
            delete require.cache[filePath];
        }
    });

    return cmds;
};

export { load };