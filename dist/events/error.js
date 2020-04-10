"use strict";
const MaytrixXEvent_1 = require("../domain/MaytrixXEvent");
class ErrorEvent extends MaytrixXEvent_1.MaytrixXEvent {
    constructor(client) {
        super(client);
    }
    run(error) {
        console.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`);
    }
}
module.exports = ErrorEvent;
