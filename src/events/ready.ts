import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";

class ReadyEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    run()
    {
        console.log("Bot Online!");
        setInterval(() => {
            let active = this.client.config.activities![Math.floor(Math.random() * this.client.config.activities!.length)];
            active = active.replace("{{prefix}}", this.client.config.defaultSettings.prefix);
            this.client.user?.setActivity({
                name: active,
                type: "WATCHING"
            });
        }, 2500);
    }
}

export = ReadyEvent;