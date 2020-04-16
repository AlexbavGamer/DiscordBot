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
const discord_js_1 = require("discord.js");
const CommandHandler_1 = require("./CommandHandler");
const EventHandler_1 = require("./EventHandler");
const moment = require("moment");
require("moment/locale/pt-br");
const Enmap = require("enmap");
const util_1 = require("util");
const _ = require("lodash");
const Dashboard_1 = require("./util/Dashboard");
class MaytrixXClient extends discord_js_1.Client {
    constructor(config, isWebSetup = false) {
        super();
        this._queue = new Map();
        this._isWebSetup = isWebSetup;
        moment.defineLocale("pt-BR", {});
        this.login(config.token);
        this._commands = CommandHandler_1.load(this);
        this._aliases = new Map();
        this._currentActivitie = 0;
        this._commands.forEach((cmd) => {
            var _a;
            (_a = cmd.conf.aliases) === null || _a === void 0 ? void 0 : _a.forEach((alias) => {
                this._aliases.set(alias, cmd.conf.name);
            });
        });
        this._events = EventHandler_1.load(this);
        this._config = config;
        this.generateInvite("ADMINISTRATOR").then(inviteLink => {
            this._config.inviteLink = inviteLink;
        });
        this._settings = new Enmap({
            name: "settings",
            cloneLevel: "deep",
        });
        this.getActivities();
        this._events.forEach((event, name) => {
            this.on(name, (...args) => {
                event.run(...args);
            });
        });
        this._levelCache = new Map();
        for (let i = 0; i < this.config.permLevels.length; i++) {
            const thisLevel = this.config.permLevels[i];
            this._levelCache.set(thisLevel.name, thisLevel.level);
        }
        this.fetchApplication().then((app) => {
            this._appInfo = app;
        });
        Dashboard_1.setup(this);
    }
    get isWebSetup() {
        return this._isWebSetup;
    }
    get queue() {
        return this._queue;
    }
    set queue(map) {
        this._queue = map;
    }
    get appInfo() {
        return this._appInfo;
    }
    get site() {
        return this._site;
    }
    set site(site) {
        this._site = site;
    }
    get currentActivitie() {
        return this._currentActivitie;
    }
    set currentActivitie(n) {
        this._currentActivitie = n;
    }
    get levelCache() {
        return this._levelCache;
    }
    get config() {
        return this._config;
    }
    get aliases() {
        return this._aliases;
    }
    get settings() {
        return this._settings;
    }
    get commands() {
        return this._commands;
    }
    getActivities() {
        if (!this._settings.has("activities"))
            this._settings.set("activities", this._config.activities);
        return this._settings.get("activities");
    }
    addActivitie(value) {
        let activities = this.getActivities();
        if (activities.includes(value))
            return;
        activities.push(value);
        this._settings.set("activities", activities);
    }
    removeActivitie(value) {
        let activities = this.getActivities();
        let found = activities.find(a => a == value);
        let index = activities.indexOf(found);
        activities = activities.filter((value, index) => value != found);
        this._settings.set("activities", activities);
    }
    loadCommand(commandName) {
        var _a;
        let command = CommandHandler_1.load(this).get(commandName);
        this.commands.set(command.conf.name, command);
        (_a = command === null || command === void 0 ? void 0 : command.conf.aliases) === null || _a === void 0 ? void 0 : _a.forEach(alias => {
            this.aliases.set(alias, command === null || command === void 0 ? void 0 : command.conf.name);
        });
        return false;
    }
    unloadCommand(commandName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Trying to unload ${commandName}`);
            const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName));
            if (!command)
                return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
            if (!command.shutdown) {
                yield command.shutdown(this);
            }
            (_a = command.conf.aliases) === null || _a === void 0 ? void 0 : _a.forEach(alias => {
                this.aliases.delete(alias);
            });
            this.commands.delete(command.conf.name);
            delete require.cache[`${command.getCommandPath()}`];
            return false;
        });
    }
    clean(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (text.constructor.name == "Promise") {
                text = yield text;
            }
            if (typeof text !== "string") {
                text = util_1.inspect(text, { depth: 0 });
            }
            text = text.replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(this.token, this.config.token);
            return text;
        });
    }
    awaitReply(message, question, limit = 60000) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (m) => m.author.id == message.author.id;
            yield message.channel.send(question);
            try {
                const collected = yield message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
                return (_a = collected.first()) === null || _a === void 0 ? void 0 : _a.content;
            }
            catch (e) {
                return false;
            }
        });
    }
    permLevel(message) {
        let permlvl = 0;
        const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && (currentLevel === null || currentLevel === void 0 ? void 0 : currentLevel.guildOnly))
                continue;
            if (currentLevel === null || currentLevel === void 0 ? void 0 : currentLevel.check(message, this)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    }
    writeSettings(id, newSettings) {
        const defaults = this.settings.get("default");
        let settings = this.settings.get(id) || {};
        this.settings.set(id, Object.assign(Object.assign({}, _.pickBy(settings, (v, k) => !_.isNil(defaults[k]))), _.pickBy(newSettings, (v, k) => !_.isNil(defaults[k]))));
    }
    getSettings(guild) {
        this.settings.ensure("default", {
            "prefix": "!",
            "modLogChannel": "mod-log",
            "modRole": "Moderator",
            "adminRole": "Administrator",
            "systemNotice": "true",
            "welcomeChannel": "welcome",
            "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
            "welcomeEnabled": "false"
        });
        if (!guild)
            return this.settings.get("default");
        const guildConf = this.settings.get(guild.id) || {};
        return (Object.assign(Object.assign({}, this.settings.get("default")), guildConf));
    }
    getUptime() {
        let uptime = process.uptime();
        const date = new Date(uptime * 1000);
        const days = date.getUTCDate() - 1, hours = date.getUTCHours(), minutes = date.getUTCMinutes(), seconds = date.getUTCSeconds(), milliseconds = date.getUTCMilliseconds();
        let segments = [];
        if (days > 0)
            segments.push(days + ' dia' + ((days == 1) ? '' : 's'));
        if (hours > 0)
            segments.push(hours + ' hora' + ((hours == 1) ? '' : 's'));
        if (minutes > 0)
            segments.push(minutes + ' minuto' + ((minutes == 1) ? '' : 's'));
        if (seconds > 0)
            segments.push(seconds + ' segundo' + ((seconds == 1) ? '' : 's'));
        if (milliseconds > 0)
            segments.push(milliseconds + ' milissegundo' + ((seconds == 1) ? '' : 's'));
        const dateString = segments.join(', ');
        return dateString;
    }
    restart() {
        console.log("Reiniciando bot");
        return new Promise(() => {
            setTimeout((client) => {
                client.destroy();
                setTimeout(() => {
                    client.login(process.env.BOT_TOKEN);
                }, 1000);
            }, 4000, this);
        });
    }
}
exports.MaytrixXClient = MaytrixXClient;
