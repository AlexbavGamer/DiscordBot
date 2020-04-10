"use strict";
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
    run(message, level, args, flags) {
        let flag = flags[0];
        message.channel.send(flag);
    }
}
module.exports = ActivitiesCommand;
