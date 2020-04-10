"use strict";
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
class RestartCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "restart",
            description: "restart the bot",
            category: "owner",
            permLevel: "Bot Owner"
        });
    }
    run(message, level, ...args) {
        message.channel.send("Bot reiniciando! ...").then((m) => {
            setTimeout(() => {
                m.edit("Bot reiniciando! ..");
                setTimeout(() => {
                    m.edit("Bot reiniciando! .");
                    setTimeout(() => {
                        m.edit("Bot reiniciado com sucesso!").then(m => m.delete({ timeout: 1000 }));
                        this.client.restart();
                    }, 1000);
                }, 1000);
            }, 1000);
        });
    }
}
module.exports = RestartCommand;
