import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";

class ErrorEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }   

    run(error : Error)
    {
        console.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`);
    }
}

export default ErrorEvent;