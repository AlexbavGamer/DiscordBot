"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const load = (client) => {
    const events = new Map();
    const eventFolders = fs_1.readdirSync(`${__dirname}/../events/`);
    eventFolders.forEach((file) => {
        let resolvePath = path.resolve(`${__dirname}/../events/${file}`);
        const eventName = path.basename(resolvePath).split(".")[0];
        const pull = require(resolvePath);
        const event = new pull(client);
        events.set(eventName, event);
    });
    return events;
};
exports.load = load;
