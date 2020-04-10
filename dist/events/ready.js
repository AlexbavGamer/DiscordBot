"use strict";
const MaytrixXEvent_1 = require("../domain/MaytrixXEvent");
class ReadyEvent extends MaytrixXEvent_1.MaytrixXEvent {
    constructor(client) {
        super(client);
    }
    run() {
        console.log("Bot Online!");
        setInterval(() => {
            var _a;
            let active = this.client.config.activities[Math.floor(Math.random() * this.client.config.activities.length)];
            active = active.replace("{{prefix}}", this.client.config.defaultSettings.prefix);
            (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setActivity({
                name: active,
                type: "WATCHING"
            });
        }, 2500);
    }
}
module.exports = ReadyEvent;
