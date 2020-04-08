import { MaytrixXClient } from "./MaytrixXClient";
import { readdirSync } from "fs";
import { join } from "path";
import path = require("path");
import { MaytrixXEvent } from "./MaytrixXEvent";

const load = (client : MaytrixXClient) : Map<string, MaytrixXEvent> => {
    const events: Map<string, MaytrixXEvent> = new Map();

    const eventFolders : Array<string> = readdirSync(`${__dirname}/../events/`);



    eventFolders.forEach((file : string) => {
        let resolvePath = path.resolve(`${__dirname}/../events/${file}`);
        const eventName = path.basename(resolvePath).split(".")[0];
        
        const pull = require(resolvePath);
        const event : MaytrixXEvent = new pull(client);

        events.set(eventName, event);
    });


    return events;
};

export { load };