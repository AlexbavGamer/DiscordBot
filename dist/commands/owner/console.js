"use strict";
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
const child_process_1 = require("child_process");
class ConsoleCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: 'console',
            description: "Execute anything in bot terminal",
            category: 'owner',
            permLevel: "Bot Owner",
        });
    }
    run(message, level, ...args) {
        const consoleArgs = args.join(" ");
        try {
            child_process_1.exec(consoleArgs, {
                encoding: 'utf8'
            }, (err, stdout, stderr) => {
                if (err) {
                    return message.channel.send(`Erro: ${err.message}`);
                }
                message.channel.send(`Saida: ${stdout}`);
            });
        }
        catch (e) {
            message.channel.send(e);
        }
    }
}
module.exports = ConsoleCommand;
