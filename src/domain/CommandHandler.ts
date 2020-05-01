import { MaytrixXClient } from "./MaytrixXClient";
import { readdirSync, readFileSync } from "fs";
import { MaytrixXCommand } from "./MaytrixXCommand";
import path from 'path';
import { Collection } from "discord.js";

const _checkForInterop = (obj : any) =>
{
    return obj && obj.__esModule ? obj.default : obj;
}

const load = (client : MaytrixXClient) : Collection<string, MaytrixXCommand> => {
    const cmds: Collection<string, MaytrixXCommand> = new Collection();

    let cmd_folder = path.resolve(__dirname, "..", "commands");
    const commandFolders : Array<string> = readdirSync(cmd_folder);

    commandFolders.forEach(async (folder : string) => {
        let commandFolder = path.resolve(cmd_folder, folder);
        let commandFiles : Array<string> = readdirSync(commandFolder).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

        for(let file of commandFiles)
        {
            try
            {
                const filePath = path.resolve(cmd_folder, folder, file);
                const pull = _checkForInterop(require(filePath));
                const cmd = new pull(client) as MaytrixXCommand;
                cmd.path = filePath;
                cmds.set(cmd.conf.name, cmd);
                delete require.cache[filePath];
            }
            catch(error) {
                console.log(error);
            }
        }
    });

    return cmds;
};

export { load };