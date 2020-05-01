import { Message } from "discord.js";
import { MaytrixXClient } from "./MaytrixXClient";
export interface PermLevel
{
    level: number,
    name: string,
    guildOnly?: boolean,
    check: (message?: Message, client?: MaytrixXClient) => boolean;
}

export interface MaytrixXDefaultSettings
{
    [key : string] : Object;
    prefix: string;
    modLogChannel: string;
    modRole: string;
    adminRole: string;
    memberRole: string;
    systemNotice: boolean;
    welcomeChannel: string;
    welcomeMessage: string;
    welcomeEnabled: boolean;
    language: string;
}

interface CommandCategoryEmoji {
    [key : string] : string;
}

const CommandCategoryEmojis = <CommandCategoryEmoji>{
    "admin": "🔒",
    "owner": "🔐",
    "youtube": "🎶",
    "system": "⚙️",
};

export interface MaytrixXConfig
{
    [key : string] : any;
    dashboard: {
        oauthSecret: string;
        callbackURL: string;
        sessionSecret: string;
        domain: string;
        port: string;
    },
    activitieType?: number | "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "CUSTOM_STATUS" | undefined;
    activitieURL?: string;
    activities?: string[];
    defaultSettings: MaytrixXDefaultSettings;
    permLevels: PermLevel[]
}

const config = <MaytrixXConfig>
{
    ownerID: "203936190133436416",
    inviteLink: "",
    admins: [],
    support: [],
    token: "NTc0Mjc3NjE2MjcwMzExNDQ2.XqS48Q.AiLKO-OGp-UOxWCLlcmkQdoeLcs",
    mongo: "mongodb://admin:001998Br@ds231207.mlab.com:31207/discordbot",
    youtubeApi: "AIzaSyB59Xg9vt1nR0GmC311t6W5k1kaPzvbfWk",
    activitieType: "WATCHING",
    activities: [
        "Type {{prefix}}help",
        "Mention me to view the prefix"
    ],
    dashboard:
    {
        oauthSecret: "Ka5eH12y0KWK9kst5uSG4RDzcJCQ2lsu",
        callbackURL: (process.env.API_SERVER_EXTERNAL) ? "https://maytrixxbot.glitch.me/calback" : "http://localhost:3000/callback",
        sessionSecret: "Afag2154",
        domain: (process.env.API_SERVER_EXTERNAL) ? "https://maytrixxbot.glitch.me" : "http://localhost:3000/",
        port: "3000"
    },
    defaultSettings:
    {
        prefix: "-",
        modLogChannel: "mod-log",
        modRole: "Moderator",
        adminRole: "Administrator",
        memberRole: "Member",
        systemNotice: true, // This gives a notice when a user tries to run a command that they do not have permission to use.
        welcomeChannel: "welcome",
        welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
        welcomeEnabled: false,
        language: "en"
    },
    permLevels:
    [
        {
            level: 0,
            name: "User",
            check: () => true
        },
        {
            level: 1,
            name: "Member",
            check: (message, client) => {
                try
                {
                    const memberRole = message!.guild!.roles.cache.find(r => r.name.toLowerCase() == client!.getSettings(message!.guild!).memberRole);
                    return (memberRole && message!.member!.roles.cache.has(memberRole.id));
                }
                catch
                {
                    return false;
                }
            }
        },
        {
            level: 2,
            name: "Moderator",
            check: (message, client) => {
                try
                {
                    const modRole = message!.guild!.roles.cache.find(r => r.name.toLowerCase() == client!.getSettings(message!.guild!).modRole);
                    return (modRole && message!.member!.roles.cache.has(modRole.id));
                }
                catch
                {
                    return false;
                }
            }
        },
        {
            level: 3,
            name: "Administrator",
            check: (message, client) => {
                try
                {
                    const modRole = message!.guild!.roles.cache.find(r => r.name.toLowerCase() == client!.getSettings(message!.guild!).adminRole);
                    return (modRole && message!.member!.roles.cache.has(modRole.id));
                }
                catch
                {
                    return false;
                }
            }
        },
        {
            level: 4,
            name: "Server Owner",
            check: (message) => {
                return message!.channel.type == "text" ? (message!.guild!.ownerID == message!.author.id ? true : false) : false
            }
        },
        {
            level: 8,
            name: "Bot Support",
            check: (message) => config.support.includes(message!.author!.id)
        },
        {
            level: 9,
            name: "Bot Admin",
            check: (message) => config.admins.includes(message!.author!.id)
        },
        {
            level: 10,
            name: "Bot Owner",
            check: (message, client) =>
            {
                return client!.config.ownerID == message!.author.id;
            }
        }
    ]
};

export default config;
export { CommandCategoryEmojis };