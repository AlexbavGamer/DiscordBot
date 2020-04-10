"use strict";
const MaytrixXEvent_1 = require("../domain/MaytrixXEvent");
class guildMemberAddEvent extends MaytrixXEvent_1.MaytrixXEvent {
    constructor(client) {
        super(client);
    }
    run(member) {
        var _a;
        const settings = this.client.getSettings(member.guild);
        const welcomeEnabled = settings.welcomeEnabled ? "true" : "false";
        if (welcomeEnabled !== "true")
            return;
        const welcomeMessage = settings.welcomeMessage.replace("{{user}}", `<@${member.user.id}>`);
        try {
            const channel = member.guild.channels.cache.find(c => c.name === settings.welcomeChannel);
            console.log(`Welcome Channel: ${(_a = channel.name) !== null && _a !== void 0 ? _a : "Undefined"}`);
            channel.send(welcomeMessage).catch(console.error);
        }
        catch (error) {
            console.log(error);
        }
    }
}
module.exports = guildMemberAddEvent;
