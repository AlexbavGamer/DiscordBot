"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MaytrixXClient_1 = require("./domain/MaytrixXClient");
const MaytrixXConfig_1 = require("./domain/MaytrixXConfig");
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
new MaytrixXClient_1.MaytrixXClient(MaytrixXConfig_1.config, true);