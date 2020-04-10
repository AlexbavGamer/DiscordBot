"use strict";
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
class ShutdownCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "shutdown",
            description: "Shutdown the bot",
            category: "owner",
            permLevel: "Bot Owner",
        });
    }
    run(message, level, ...args) {
    }
}
module.exports = ShutdownCommand;
