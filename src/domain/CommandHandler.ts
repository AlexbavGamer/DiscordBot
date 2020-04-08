import { MaytrixXClient } from "./MaytrixXClient";
import { readdirSync } from "fs";
import { MaytrixXCommand } from "./MaytrixXCommand";
import { join } from "path";
import path = require("path");

const load = (client : MaytrixXClient) : Map<string, MaytrixXCommand> => {
    const cmds: Map<string, MaytrixXCommand> = new Map();

    const commandFolders : Array<string> = readdirSync(`${__dirname}/../commands/`);



    commandFolders.forEach((folder : string) => {
        const commandFiles : Array<string> = readdirSync(`${__dirname}/../commands/${folder}/`).filter((c: string) => c.endsWith(".js"));

        for(let file of commandFiles)
        {
            const filePath = path.resolve(`${__dirname}/../commands/${folder}/${file}`);
            console.log(filePath);
            const pull = require(filePath);
            const cmd = new pull(client) as MaytrixXCommand;

            cmds.set(cmd.conf.name, cmd);
            delete require.cache[filePath];
        }
    });

    return cmds;
};

export { load };