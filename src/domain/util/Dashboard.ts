import * as url from "url";
import * as path from "path";

import * as Discord from "discord.js";

import * as express from "express";
import * as moment from "moment";
require("moment-duration-format");
import * as passport from "passport";
import * as session from "express-session";
import { Strategy, } from "passport-discord";
const app = express();

import * as connectMongo from "connect-mongo";

const MongoStore = connectMongo(session);
import * as helmet from "helmet";
import { doesNotMatch } from "assert";
import { MaytrixXClient } from "../MaytrixXClient";
import * as bodyParser from "body-parser";
import * as md from "marked";
import { GuildMember, User } from "discord.js";
const setup = async (client : MaytrixXClient) => {
    const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

    app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));

    passport.serializeUser((user,done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    let appInfo = await client.fetchApplication();
    passport.use(new Strategy({
        clientID: appInfo.id,
        clientSecret: client.config.dashboard.oauthSecret,
        callbackURL: client.config.dashboard.callbackURL,
        scope: ["identify", "guilds"]
    },
    (accessToken : string, refreshToken : string, profile : Strategy.Profile, done : (err?: Error | null, user?: object, info?: object) => void) => {
        process.nextTick(() => done(null, profile));
    }));

    app.use(session({
        store: new MongoStore({ url : client.config.mongo }),
        secret: client.config.dashboard.sessionSecret,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());

    app.locals.domain = client.config.dashboard.domain; 

    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "ejs");
    app.set("views", templateDir);
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    function checkAuth(req : express.Request, res : express.Response, next : express.NextFunction)
    {
        if(req.isAuthenticated()) return next();
        req.session!.backURL = req.url;
        res.redirect("/login");
    }

    const renderTemplate = (req : express.Request, res : express.Response, template : string, data?: any) =>
    {
        const baseData = {
            bot : client,
            path : req.path,
            user : req.isAuthenticated() ? req.user : null,
        };

        res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    }

    app.get("/login", (req, res, next) => {
        if(req.session!.backURL)
        {
            req.session!.backURL = req.session!.backURL;
        }
        else if(req.headers.referer)
        {
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname === app.locals.domain)
            {
                req.session!.backURL = parsed.path;
            }
        }
        else
        {
            req.session!.backURL = "/";
        }
        next();
    },passport.authenticate("discord"));

    app.use("/callback", passport.authenticate("discord", {
        failureRedirect: "/autherror"
    }),async (req, res) => 
    {
        let appInfo = await client.fetchApplication();
        if((<any>req.user).id === appInfo.owner?.id)
        {
            req.session!.isAdmin = true;
        }
        else
        {
            req.session!.isAdmin = false;
        }
        if(req.session!.backURL)
        {
            const url = req.session!.backURL;
            req.session!.backURL = null;
            res.redirect(url);
        }
        else
        {
            res.redirect("/");
        }
    });

    app.get("/autherror", (req, res) => {
        renderTemplate(req, res, "autherror.ejs", {});
    });

    app.get("/logout", (req, res) => {
        req.session?.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });
    
    app.get("/", (req, res) => {
        renderTemplate(req, res, "index.ejs", {});
    });

    app.get("/commands", (req, res) => {
        renderTemplate(req, res, "commands.ejs", {
            md
        });
    });

    app.get("/stats", (req, res) => {
        const duration = moment.duration(client.uptime!).format(" D [days], H [hrs], m [mins], s [secs]");
        const members = client.guilds.cache.reduce((p, c) => p + c.memberCount, 0);
        const textChannels = client.channels.cache.filter(c => c.type == "text").size;
        const voiceChannels = client.channels.cache.filter(c => c.type == "voice").size;
        const guilds = client.guilds.cache.size;
        renderTemplate(req, res, "stats.ejs", {
            stats: {
                servers: guilds,
                members: members,
                text: textChannels,
                voice: voiceChannels,
                uptime: duration,
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                dVersion : Discord.version,
                nVersion : process.version,
            }
        });
    });

    app.get("/dashboard", checkAuth, (req, res) => {
        const perms = Discord.Permissions;
        renderTemplate(req, res, "dashboard.ejs", {perms});
    });

    app.get("/admin", checkAuth, (req, res) => {
        if(!req.session!.isAdmin) return res.redirect("/");
        renderTemplate(req, res, "admin.ejs");
    });

    app.get("/dashboard/:guildID", checkAuth, (req, res) => {
        res.redirect(`/dashboard/${req.params.guildID}/manage`);
    });

    app.get("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if(!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user).id) ? guild.member((<any>req.user).id)?.permissions.has("MANAGE_GUILD") : false;
        if(!isManaged && !req.session!.isAdmin) res.redirect("/");
        renderTemplate(req, res, "guild/manage.ejs", {guild});
    });

    app.post("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if(!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user).id) ? guild.member((<any>req.user).id)?.permissions.has("MANAGE_GUILD") : false;
        if(!isManaged && !req.session!.isAdmin) res.redirect("/");
        client.writeSettings(guild.id, req.body);
        res.redirect(`/dashboard/${req.params.guildID}/manage`);
    });

    app.get("/dashboard/:guildID/members", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if(!guild) return res.status(404);
        renderTemplate(req, res, "guild/members.ejs", {
            guild: guild,
            members: guild.members.cache.array()
        });
    });

    app.get("/dashboard/:guildID/members/list", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if(!guild) return res.status(404);
        if(req.query.fetch)
        {
            await guild.members.fetch();
        }
        const totals = guild.members.cache.size;
        const start = parseInt(<string>req.query.start, 10) || 0;
        const limit = parseInt(<string>req.query.limit, 10) || 50;

        let members = guild.members.cache;

        if(req.query.filter && req.query.filter !== "null")
        {
            members = members.filter((m) => 
            {
                (<User | Discord.GuildMember>m) = req.query.filterUser ? m.user : m;
                return m["displayName"].toLowerCase().includes(req.query.filter.toString().toLowerCase());
            });
        }

        if(req.query.sortby)
        {
            members = members.sort((a, b) => {
                let _a : any = a;
                let _b : any = b;

                return _a[req.query.sortby.toString()] > _b[req.query.sortby.toString()] ? 1 : -1;
            });
        }

        const membersArray = members.array().slice(start, start+limit);

        const returnObject = [];

        for(let i = 0; i < membersArray!.length; i++)
        {
            const m = membersArray[i];
            returnObject.push({
                id: m.id,
                status: m.user.presence.status,
                bot: m.user.bot,
                username: m.user.username,
                displayName: m.displayName,
                tag: m.user.tag,
                discriminator: m.user.discriminator,
                joinedAt: m.joinedAt,
                createdAt: m.user.createdTimestamp,
                highestRole: {
                    hexColor: m.roles.highest.hexColor,
                },
                memberFor: moment.duration(Date.now() - m!.joinedTimestamp!).format(" D [days], H [hrs], m [mins], s [secs]"),
                role: m.roles.cache.map(r => ({
                    name: r.name,
                    id: r.id,
                    hexColor: r.hexColor,
                })),
            });
        }
        res.json({
            total: totals,
            page: (start/limit)+1,
            pageof: Math.ceil(members.size / limit),
            members: returnObject,
        });
    });

    app.get("/dashboard/:guildID/stats", checkAuth, (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user).id) ? guild.members.cache.get((<any>req.user).id)!.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        renderTemplate(req, res, "guild/stats.ejs", {guild});
    });

    app.get("/dashboard/:guildID/leave", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user).id) ? guild.members.cache.get((<any>req.user).id)!.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        await guild.leave();
        res.redirect("/dashboard");
    });

    app.get("/dashboard/:guildID/reset", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user).id) ? guild.members.cache.get((<any>req.user).id)!.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        client.settings.delete(guild.id);
        res.redirect("/dashboard/"+req.params.guildID);
    });

    client.site = app.listen(client.config.dashboard.port);
};

export { setup };