"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    ownerID: "203936190133436416",
    inviteLink: "",
    admins: [],
    support: [],
    token: "NTc0Mjc3NjE2MjcwMzExNDQ2.Xo5cDg.LyivEA5xXcvaumpqAcbaoPy9FlQ",
    mongo: "mongodb://admin:001998Br@ds231207.mlab.com:31207/discordbot",
    activitieType: "CUSTOM_STATUS",
    activities: [
        "Type {{prefix}}help",
        "Mention me to view the prefix"
    ],
    dashboard: {
        oauthSecret: "Ka5eH12y0KWK9kst5uSG4RDzcJCQ2lsu",
        callbackURL: "https://maytrixxbot.glitch.me/callback",
        sessionSecret: "Afag2154",
        domain: "https://maytrixxbot.glitch.me/",
        port: "3000"
    },
    defaultSettings: {
        prefix: "-",
        modLogChannel: "mod-log",
        modRole: "Moderator",
        adminRole: "Administrator",
        systemNotice: true,
        welcomeChannel: "welcome",
        welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
        welcomeEnabled: false
    },
    permLevels: [
        {
            level: 0,
            name: "User",
            check: () => true
        },
        {
            level: 2,
            name: "Moderator",
            check: (message, client) => {
                var _a;
                try {
                    const modRole = (message === null || message === void 0 ? void 0 : message.guild).roles.cache.find(r => r.name.toLowerCase() == (client === null || client === void 0 ? void 0 : client.getSettings(message.guild).modRole));
                    return (modRole && ((_a = message === null || message === void 0 ? void 0 : message.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has(modRole.id)));
                }
                catch (_b) {
                    return false;
                }
            }
        },
        {
            level: 3,
            name: "Administrator",
            check: (message, client) => {
                var _a;
                try {
                    const modRole = (message === null || message === void 0 ? void 0 : message.guild).roles.cache.find(r => r.name.toLowerCase() == (client === null || client === void 0 ? void 0 : client.getSettings(message.guild).adminRole));
                    return (modRole && ((_a = message === null || message === void 0 ? void 0 : message.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has(modRole.id)));
                }
                catch (_b) {
                    return false;
                }
            }
        },
        {
            level: 4,
            name: "Server Owner",
            check: (message, client) => {
                var _a;
                return (message === null || message === void 0 ? void 0 : message.channel.type) == "text" ? (((_a = message.guild) === null || _a === void 0 ? void 0 : _a.ownerID) == message.author.id ? true : false) : false;
            }
        },
        {
            level: 8,
            name: "Bot Support",
            check: (message) => config.support.includes((message === null || message === void 0 ? void 0 : message.author).id)
        },
        {
            level: 9,
            name: "Bot Admin",
            check: (message) => config.admins.includes((message === null || message === void 0 ? void 0 : message.author).id)
        },
        {
            level: 10,
            name: "Bot Owner",
            check: (message, client) => {
                return (client === null || client === void 0 ? void 0 : client.config.ownerID) == (message === null || message === void 0 ? void 0 : message.author.id);
            }
        }
    ]
};
exports.config = config;
