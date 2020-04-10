"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MaytrixXCommand {
    constructor(client, conf) {
        this._client = client;
        this._conf = conf;
    }
    get conf() {
        return this._conf;
    }
    get client() {
        return this._client;
    }
}
exports.MaytrixXCommand = MaytrixXCommand;
