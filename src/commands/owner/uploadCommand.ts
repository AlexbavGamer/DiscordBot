import { MaytrixXCommand } from "../../domain/MaytrixXCommand";
import { MaytrixXClient } from "../../domain/MaytrixXClient";
import { Message } from "discord.js";
import { resolve } from "path";
import { loadFromPath } from "../../domain/CommandHandler";
export default class uploadCommand extends MaytrixXCommand
{
    constructor(client : MaytrixXClient)
    {
        super(client, {
            name: "uploadcommand",
            category: "owner",
            permLevel: "Bot Owner",
        });
    }

    async run(message : Message, level : number, args : Array<string>)
    {
        var dirToUpload = await this.client.awaitReply(message, "Where i will put the file?");

        if(dirToUpload)
        {
            dirToUpload = resolve(__dirname, "..", dirToUpload.toString());

            var file = await this.client.awaitAttachment(message, "Now just upload the file");

            if(file)
            {
                
                const fileName = await this.client.downloadFile(file.url, dirToUpload) as string;

                var cmd = loadFromPath(this.client, fileName);
                var success = this.client.loadCommandFromFile(cmd);  
                if(success)
                {
                    message.reply(`Comando *${cmd.conf.name}* carregado com sucesso`);
                }     
            }
        }
    }
}