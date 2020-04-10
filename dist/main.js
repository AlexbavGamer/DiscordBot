"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MaytrixXClient_1 = require("./domain/MaytrixXClient");
const dotenv_1 = require("dotenv");
const MaytrixXConfig_1 = require("./domain/MaytrixXConfig");
dotenv_1.config({ path: __dirname + "/../src/.env" });
String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};
String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
String.prototype.Truncate = function (maxLength, side, ellipsis = "...") {
    var str = this;
    if (str.length > maxLength) {
        switch (side) {
            case "start":
                {
                    return ellipsis + str.slice(-(maxLength - ellipsis.length));
                }
            case "end":
                {
                    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
                }
        }
    }
    return str.toString();
};
const bot = new MaytrixXClient_1.MaytrixXClient(MaytrixXConfig_1.config);
