import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { isUndefined } from "lodash";
import Path from "path";
import { readdirSync, writeFile } from "fs";
class LanguageCommand extends MaytrixXCommand
{
    constructor(client: MaytrixXClient)
    {
        super(client, {
            name: "language",
            category: "owner",
            description: "create or modify language files",
            usage: "-list, -create, -remove, -get, -add",
            aliases: ["lang", "idioma"],
            permLevel: "Bot Owner",
            guildOnly: false,
        });
    }

    async run(message : Message, level : number, args : Array<string>, flags : Array<any>)
    {
        if(!flags)
        {
            message.channel.send(`Usage: /${this.conf.name} [${this.conf.usage}]`);
            return;
        }
        else
        {
            if(flags[0] == "list")
            {
                if(args[0])
                {
                    var LangsPath = Path.resolve(__dirname, "..", "..", "i18n", "locales");
                    let languageFiles : Array<string> = readdirSync(LangsPath).filter(file => file.endsWith(".json"));
                    languageFiles.forEach(async lang => {
                            if(lang.includes(args[0]))
                            {
                                const filePath = Path.resolve(LangsPath, lang);
                                const jsonFile = require(filePath);
                                
                                message.channel.send(Object.keys(jsonFile).filter(key => !key.includes("__comment")).join(", "));
                            }
                    });
                }
            }
            else if(flags[0] == "get")
            {
                if(args[0] && args[1])
                {
                    var LangsPath = Path.resolve(__dirname, "..", "..", "i18n", "locales");
                    let languageFile : Array<string> = readdirSync(LangsPath).filter(file => file.endsWith(".json") && file.includes(args[0]));
                    const jsonFile = require(Path.resolve(LangsPath, languageFile[0]));
                    const key = Object.keys(jsonFile).filter(key => key.includes(args[1])).pop()!;
                    message.channel.send(jsonFile[key]);
                }
            }
            else if(flags[0] == "set")
            {
                if(args.length > 2)
                {
                    var LangsPath = Path.resolve(__dirname, "..", "..", "i18n", "locales");
                    let languageFile : Array<string> = readdirSync(LangsPath).filter(file => file.endsWith(".json") && file.includes(args[0]));
                    const jsonFile = require(Path.resolve(LangsPath, languageFile[0]));
                    const key = Object.keys(jsonFile).filter(key => key.includes(args[1])).pop()!;
                    jsonFile[key] = args.slice(2).join(" ");
                    writeFile(Path.resolve(LangsPath, languageFile[0]), JSON.stringify(jsonFile, null, 4), (err) => {
                        if(err)
                        {
                            message.channel.send(err);
                        }
                    });
                }
            }
        }
    }
}

export default LanguageCommand;