"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class MaytrixXWebPanel {
    constructor(bot) {
        this._bot = bot;
        this._app = express();
        this._app.listen(process.env.PORT);
        this._app.get("/", (req, res) => {
            res.send("Nada para ver aqui");
        });
    }
    get app() {
        return this._app;
    }
    get bot() {
        return this._bot;
    }
}
exports.MaytrixXWebPanel = MaytrixXWebPanel;
