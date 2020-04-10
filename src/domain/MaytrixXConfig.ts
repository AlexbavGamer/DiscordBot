import { Message } from "discord.js";
import { MaytrixXClient } from "./MaytrixXClient";  
interface PermLevel
{
    level: number,
    name: string,
    guildOnly?: boolean,
    check: (message?: Message, client?: MaytrixXClient) => boolean;
}

interface MaytrixXDefaultSettings
{
    prefix: string;
    modLogChannel: string;
    modRole: string;
    adminRole: string;
    systemNotice: boolean;
    welcomeChannel: string;
    welcomeMessage: string;
    welcomeEnabled: boolean;
}

interface MaytrixXConfig
{
    ownerID: string;
    inviteLink: string;
    admins: string[];
    support: string[],
    token: string;
    mongo: string;
    dashboard: {
        oauthSecret: string;
        callbackURL: string;
        sessionSecret: string;
        domain: string;
        port: string;
    },
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
    token: "NTc0Mjc3NjE2MjcwMzExNDQ2.Xo5cDg.LyivEA5xXcvaumpqAcbaoPy9FlQ",
    mongo: "mongodb://admin:001998Br@ds231207.mlab.com:31207/discordbot",
    activities: [
        "Type {{prefix}}help",
        "Mention me to view the prefix"
    ],
    dashboard:
    {
        oauthSecret: "Ka5eH12y0KWK9kst5uSG4RDzcJCQ2lsu",
        callbackURL: "https://maytrixxbot.glitch.me/callback",
        sessionSecret: "Afag2154",
        domain: "https://maytrixxbot.glitch.me/",
        port: "3000"
    },
    defaultSettings:
    {
        prefix: "-",
        modLogChannel: "mod-log",
        modRole: "Moderator",
        adminRole: "Administrator",
        systemNotice: true, // This gives a notice when a user tries to run a command that they do not have permission to use.
        welcomeChannel: "welcome",
        welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
        welcomeEnabled: false
    },
    permLevels:
    [
        {
            level: 0,
            name: "User",
            check: () => true
        },
        {
            level: 2,
            name: "Moderator",
            check: (message, client) => {
                try
                {
                    const modRole = message?.guild!.roles.cache.find(r => r.name.toLowerCase() == client?.getSettings(message!.guild!).modRole);
                    return (modRole && message?.member?.roles.cache.has(modRole.id));
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
                    const modRole = message?.guild!.roles.cache.find(r => r.name.toLowerCase() == client?.getSettings(message!.guild!).adminRole);
                    return (modRole && message?.member?.roles.cache.has(modRole.id));
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
            check: (message, client) => {
                return message?.channel.type == "text" ? (message.guild?.ownerID == message.author.id ? true : false) : false
            }
        },
        { 
            level: 8,
            name: "Bot Support",
            // The check is by reading if an ID is part of this array. Yes, this means you need to
            // change this and reboot the bot to add a support user. Make it better yourself!
            check: (message) => config.support.includes(message?.author!.id)
        },
        {
            level: 9,
            name: "Bot Admin",
            check: (message) => config.admins.includes(message?.author!.id)
        },
        {
            level: 10,
            name: "Bot Owner",
            check: (message, client) => 
            {
                return client?.config.ownerID == message?.author.id;
            }
        }
    ]
};

export { config, MaytrixXConfig, MaytrixXDefaultSettings };