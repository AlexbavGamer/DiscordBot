"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
let client;
let queue;
exports.Initialize = (pClient, pQueue) => {
    client = pClient;
    queue = pQueue;
};
app.get("/", (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query("SELECT * FROM hellotable");
        res.send(`${result.rows[0].name} Success redis\n`);
    }
    catch (error) {
        next(error);
    }
}));
app.get("/intense", (_, res, next) => {
    const job = queue.create('mytype', {
        letter: 'a',
        title: 'mytitle'
    })
        .removeOnComplete(true)
        .save((error) => {
        if (error) {
            next(error);
            return;
        }
        job.on('complete', result => {
            res.send(`Hello Intense ${result}`);
        });
        job.on('failed', () => {
            const failedError = new Error("failed");
            next(failedError);
        });
    });
});
exports.default = app;
