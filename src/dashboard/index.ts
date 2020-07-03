import { MaytrixXClient } from "../domain/MaytrixXClient";
import express, { Application } from "express";
import handlebars, { HelperOptions } from "handlebars";
import exphbs from "express-handlebars";
import path from "path";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import discord from "discord.js";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-discord";
import helmet from "helmet";
import url from "url";
import "moment-duration-format";
const SQLiteStore = require("connect-sqlite3")(session);
import md from "marked";
import ejs from "ejs";
import bodyParser from "body-parser";
import { isHerokuInstance } from "../domain/MaytrixXConfig";
import { User } from "discord.js";
import { type } from "os";
import { GuildMember } from "discord.js";
import moment from "moment";
import { UserManager } from "discord.js";
interface DiscordUser extends Express.User
{
    id: string,
    username: string,
    avatar: string,
    discriminator: string,
    public_flags: string,
    flags: number,
    email: string,
    verified: boolean,
    locale: string,
    mfa_enabled: boolean,
    provider: string,
    accessToken: string,
    guilds: [{
        id: string,
        name: string,
        icon: string,
        owner: boolean,
        permissions: number,
        features: Array<any>
    }]
}

type Conditional = (lvalue : any, rvalue : any) => boolean;

const setup = (client : MaytrixXClient) : Application  => {

    let app = express();

    const dataDir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}dashboard`);
    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
    
    app.engine('html', ejs.renderFile);
    app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));
    app.set('view engine', 'html');

    //Setup
    passport.serializeUser((user : DiscordUser, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj : DiscordUser, done) => {
        done(null, obj);
    });

    passport.use(new Strategy({
        clientID: client.application.id,
        clientSecret: client.config.dashboard.oauthSecret,
        callbackURL: client.formatArgs(client.config.dashboard.callbackURL),
        scope: ["identify", "guilds"]
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
    }));

    app.use(session({
        store: new SQLiteStore({ 
          dir: "./data"
        }),
        secret: client.config.dashboard.sessionSecret,
        resave: false,
        saveUninitialized: false,
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());

    app.locals.domain = client.formatArgs(client.config.dashboard.domain);
    app.locals.getUserAvatar = function(user : any)
    {
        let id = user.id;
        var realUser = client.users.cache.has(id) ? client.users.cache.get(id) : null;
        if(realUser)
        {
            return realUser.avatarURL();
        }
        return "";
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    })); 
    function renderTemplate(req : express.Request, res : express.Response, template : string, data ?: {[key : string] : any})
    {
        let baseData = {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            title: data!.title,
        }

        res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    }

    function checkAuth(req : express.Request, res : express.Response, next : express.NextFunction)
    {
        if(req.isAuthenticated()) return next();
        req.session!.backURL = req.url;
        res.redirect("/login");
    }

    app.get("/admin", checkAuth, (req, res) => {
        if (!req.session!.isAdmin) return res.redirect("/");
        renderTemplate(req, res, "admin.ejs", {
            title: "Admin"
        });
    });

    app.get("/dashboard/:guildID", checkAuth, (req, res) => {
        res.redirect(`/dashboard/${req.params.guildID}/manage`);
    });

    app.get("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if(!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user!).id) ? guild.member((<any>req.user!).id)?.permissions.has("MANAGE_GUILD") : false;
        if(!isManaged && !req.session!.isAdmin) res.redirect("/");
        renderTemplate(req, res, "guild/manage.ejs", {guild}); 
    });

    app.post("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user!).id) ? guild.member((<any>req.user!).id)?.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        client.writeSettings(guild.id, req.body);
        res.redirect("/dashboard/"+req.params.guildID+"/manage");
    });

    app.get("/dashboard/:guildID/members", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        renderTemplate(req, res, "guild/members.ejs", {
          guild: guild,
          members: guild.members.cache.array()
        });
    });

    app.get("/dashboard/:guildID/members/list", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params!.guildID);
        if(!guild) return res.status(404);
        if(req.query.fetch)
        {
            await guild.members.fetch();
        }
        const totals = guild.members.cache.size;
        const start = parseInt(req.query!.start.toString(), 10) || 0;
        const limit = parseInt(req.query!.limit.toString(), 10) || 50;

        let members : any = guild.members.cache;
        //let members : any[] = guild.members.cache.array();

        if(req.query!.filter && req.query!.filter !== "null")
        {
            members = members.filter((m : any) => {
                m = req.query!.filterUser ? m.user : m;
                return m["displayName"].toLowerCase().includes(req.query.filter.toString().toLowerCase());
            });
        }

        if(req.query!.sortby)
        {   
            members = members.sort((a : any, b : any) => 
            {
                var sortArray = req.query!.sortby.toString().split(".");
                if(sortArray.length > 1)
                {
                    var resultA = a;
                    var resultB = b;
                    sortArray.forEach(sort => {
                        resultA = resultA[sort];
                        resultB = resultB[sort];
                    });
                    if(resultA < resultB)
                    {
                        return 1;
                    }
                    else if(resultA > resultB)
                    {
                        return -1;
                    }
                    return 0;
                }
                if(a < b)
                {
                    return -1;
                }
                else if(a > b)
                {
                    return 1;
                }
                return 0;
            })
        }

        const memberArray = members.array().slice(start, start+limit);
        const returnObject = [];
        for (let i = 0; i < memberArray.length; i++) 
        {
            const m = memberArray[i];
            returnObject.push({
                id: m.id,
                status: m.user.presence.status,
                bot: m.user.bot,
                username: m.user.username,
                displayName: m.displayName,
                tag: m.user.tag,
                discriminator: m.user.discriminator,
                joinedAt: m.joinedTimestamp,
                createdAt: m.user.createdTimestamp,
                highestRole: {
                hexColor: m.roles.highest.hexColor
                },
                memberFor: moment.duration(Date.now() - m.joinedAt!.valueOf()).format(" D [days], H [hrs], m [mins], s [secs]"),
                roles: m.roles.cache.map((r : any)=>({
                name: r.name,
                id: r.id,
                hexColor: r.hexColor
                }))
            });
        }

        res.json({
            total: totals,
            page: (start/limit)+1,
            pageof: Math.ceil(members.length / limit),
            members: returnObject
        });
    });

    app.get("/", (req, res) => {
        renderTemplate(req, res, "index.ejs", {
            title: "Home"
        });
    });

    app.get("/dashboard/:guildID/leave", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID!);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user!).id) ? guild.member((<any>req.user!).id)?.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        await guild.leave();
        res.redirect("/dashboard");
      });

      app.get("/dashboard", checkAuth, (req, res) => {
        const perms = discord.Permissions;
        renderTemplate(req, res, "dashboard.ejs", {perms});
      });

      app.get("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user).id) ? guild.member((<any>req.user).id)?.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        renderTemplate(req, res, "guild/manage.ejs", {guild});
      });

      app.get("/dashboard/:guildID/reset", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member((<any>req.user!).id) ? guild.member((<any>req.user!).id)?.permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session!.isAdmin) res.redirect("/");
        client.settings.delete(guild.id);
        res.redirect("/dashboard/"+req.params.guildID);
      });

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), (req, res) => {
        if(client.owners.includes((<any>req!.user!).id))
        {
            req!.session!.isAdmin = true;
        }
        else
        {
            req!.session!.isAdmin = false;
        }

        if(req!.session!.backURL)
        {
            const url = req!.session!.backURL;
            req!.session!.backURL = null;
            res.redirect(url);
        }
        else
        {
            res.redirect("/");
        }
    });

    app.get("/autherror", (req, res) => 
    {
        renderTemplate(req, res, "autherror.ejs");
    });

    app.get("/login", (req, res, next) => {
        if (req!.session!.backURL) {
          next();
        } else if (req.headers.referer) {
          const parsed = url.parse(req.headers!.referer.toString());
          if (parsed.hostname === app.locals.domain) {
            req!.session!.backURL = parsed.path;
          }
        } else {
          req!.session!.backURL = "/";
        }
        next();
      },
      passport.authenticate("discord"));

    app.get("/logout", function(req, res) {
        req!.session!.destroy(() => {
          req.logout();
          res.redirect("/"); //Inside a callback… bulletproof!
        });
    });

    app.get("/commands", (req, res) => {
        renderTemplate(req, res, "commands.ejs", {md});
    });

    app.get("/stats", (req, res) => {
        const duration = client.getUptime();
        const members = client.guilds.cache.reduce((p, c) => p + c.memberCount, 0);
        const onlineMembers = client.guilds.cache.reduce((p, c) => p + c.members.cache.filter(member => member.presence.status != "offline").size, 0);
        const offlineMembers = client.guilds.cache.reduce((p, c) => p + c.members.cache.filter(member => member.presence.status == "offline").size, 0);
        const textChannels = client.channels.cache.filter(c => c.type === "text").size;
        const voiceChannels = client.channels.cache.filter(c => c.type === "voice").size;

        const guilds = client.guilds.cache.size;

        renderTemplate(req, res, "stats.ejs", {
            title: 'Bot Info',
            stats: {
                servers: guilds,
                members: 
                {
                    online: onlineMembers,
                    offline: offlineMembers   
                },
                text: textChannels,
                voice: voiceChannels,
                uptime: duration,
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                dVersion: discord.version,
                nVersion: process.version
            }
        });
    
    });


    app.use((req, res, next) => {
        res.status(404);

        if(req.accepts('html'))
        {
            renderTemplate(req, res, "notfound.ejs", 
            {
                page: req.path.split("/")[req.path.split("/").length -1].toProperCase(),
                title: "Page not found"
            });
            return;
        }

        if(req.accepts("json"))
        {
            res.send({
                error: "not found"
            });
        }

        res.type('txt').send('not found');
    });

    app.listen(client.config.dashboard.port, (err) => {
        if(err) throw err;

        console.log(`Listen in ${client.formatArgs(client.config.dashboard.domain)} with port ${client.config.dashboard.port}`);    
    });
    return app;
};

export {setup};