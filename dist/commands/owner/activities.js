"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MaytrixXCommand_1 = require("../../domain/MaytrixXCommand");
class ActivitiesCommand extends MaytrixXCommand_1.MaytrixXCommand {
    constructor(client) {
        super(client, {
            name: "act",
            description: "Manage bot activities",
            category: "owner",
            permLevel: "Bot Owner",
            aliases: ["activitie"]
        });
    }
    run(message, level, args) {
        let flag = message.flags.toArray()[0];
        message.channel.send(flag);
    }
}
