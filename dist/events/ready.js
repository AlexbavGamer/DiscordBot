"use strict";
const MaytrixXEvent_1 = require("../domain/MaytrixXEvent");
class ReadyEvent extends MaytrixXEvent_1.MaytrixXEvent {
    constructor(client) {
        super(client);
    }
    run() {
        console.log("Bot Online!");
        let activities = this.client.getActivities();
        setInterval(() => {
            var _a;
            let active = activities[Math.floor(Math.random() * activities.length)];
            active = active.replaceAll("{{prefix}}", this.client.config.defaultSettings.prefix)
                .replaceAll("{{guilds}}", this.client.guilds.cache.size.toString())
                .replaceAll("{{channels}}", this.client.channels.cache.size.toString())
                .replaceAll("{{users}},", this.client.users.cache.size.toString());
            (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setActivity({
                name: active,
                url: this.client.config.activitieURL,
                type: this.client.config.activitieType
            });
        }, 2500);
    }
}
module.exports = ReadyEvent;
