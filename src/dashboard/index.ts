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
import { GuildMember, User, Team, TextChannel, VoiceChannel, PartialGroupDMChannel, NewsChannel, CategoryChannel, DMChannel } from "discord.js";
import moment from "moment";
const SQLiteStore = require("connect-sqlite3")(session);
import md from "marked";
import { isHerokuInstance } from "../domain/MaytrixXConfig";

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

    let hbs = exphbs.create({
        extname: ".hbs",
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: [
            path.join(__dirname, 'views', 'partials'),
            path.join(__dirname, 'shared', 'templates'),
        ],
        defaultLayout: 'default',
        helpers: {
            getBotAvatar: function()
            {
                return client.user!.avatarURL();
            },
            getUserAvatar: function(user : User)
            {
                if(arguments.length < 1)
                {
                    throw new Error("Handlerbars Helper 'getUserAvatar' needs 1 parameters");
                }
                let avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
                return avatar;
            },
            renderBreadcrumb: function(path : string)
            {
                let pathArray = path.split("/").slice(1);
                pathArray = pathArray.map(p => {
                    if(client.guilds.cache.has(p)) return client.guilds.cache.get(p)!.name!;
                    if(client.users.cache.has(p)) return client.users.cache.get(p)!.username!;
                    if(client.channels.cache.has(p)) 
                    {
                        let channel = client.channels.cache.get(p);
                        if(channel!.type == "text")
                        {
                            return (<TextChannel>channel).name;
                        }
                        else if(channel!.type == "voice")
                        {
                            return (<VoiceChannel>channel).name;
                        }
                        else if(channel!.type == "group")
                        {
                            return (<PartialGroupDMChannel>channel).name;
                        }
                        else if(channel!.type == "news")
                        {
                            return (<NewsChannel>channel).name;
                        }
                        else if(channel!.type == "category")
                        {
                            return (<CategoryChannel>channel).name;
                        }
                        else if(channel!.type == "dm")
                        {
                            return (<DMChannel>channel).recipient.username;
                        }
                        return "Unkown";
                    };
                    return p.toProperCase();
                });
                let builtPath = "";
                let result = "";
                for(let i = 0; i < pathArray.length; i++) 
                {
                    builtPath += "/" + path.split("/").slice(1)[i];
                    result += `<li class="breadcrumb-item ${((i+1 === pathArray.length) ? "active" : "")}">${((i+1 !== pathArray.length ? `<a href="${builtPath}">${pathArray[i]}</a>` : `<a>${pathArray[i]}</a>`))}</li>`;
                }
                return result;
            },
            getTeamMebers: function()
            {
                if(client.application.owner instanceof Team)
                {
                    let team = <Team>client.application.owner;
                    return team.members.map(member => member.user.username).join(", ");
                }
            },
            getOwnerName: function()
            {
                if(client.application.owner instanceof Team)
                {
                    let team = <Team>client.application.owner;
                    return client.users.cache.get(team.ownerID!)!.username!;
                }
                else if(client.application.owner instanceof User)
                {
                    let user = <User>client.application.owner;
                    return user.username;
                }
            },
            json: function(context : any)
            {
                return JSON.stringify(context);
            },
            compare: function(lvalue : any, operator : string, rvalue : any, options : HelperOptions)
            {
                var operators : Map<string, Conditional> = new Map(), result : boolean = false;

                if(arguments.length < 3)
                {
                    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
                }

                if(options === undefined)
                {
                    options = rvalue;
                    rvalue = operator;
                    operator = "===";
                }

                operators.set("==", (l, r) => l == r);
                operators.set("===", (l, r) => l === r);
                operators.set("!=", (l, r) => l != r);
                operators.set("!==", (l, r) => l !== r);
                operators.set("<", (l, r) => l < r);
                operators.set(">", (l, r) => l > r);
                operators.set("<=", (l, r) => l <= r);
                operators.set(">=", (l, r) => l >= r);
                operators.set("typeof", (l, r) => typeof l == r);

                if(!operators.has(operator))
                {
                    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
                }

                result = operators!.get(operator)!(lvalue, rvalue);
                if(result)
                {
                    return options.fn(this);
                }
                return options.inverse(this);
            }
        },
        handlebars: allowInsecurePrototypeAccess(handlebars)
    });

    

    app.engine('.hbs', hbs.engine);
    app.use("/public", express.static(path.join(__dirname, 'public')));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', '.hbs');

    //Setup
    passport.serializeUser((user : DiscordUser, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj : DiscordUser, done) => {
        done(null, obj);
    });

    passport.use(new Strategy({
        clientID: "574277616270311446",
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

    function renderTemplate(req : express.Request, res : express.Response, template : string, data ?: {[key : string] : any})
    {
        let baseData = {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            title: data!.title ?? req.path.split("/")[1].toProperCase(),
        }

        res.render(template, Object.assign(baseData, data));
    }

    

    function exposeTemplates(req : express.Request, res : express.Response, next : express.NextFunction)
    {
        hbs.getTemplates(path.join(__dirname, 'shared', 'templates'), {
            cache: app.enabled('view cache'),
            precompiled: true
        }).then((templates : any) => {
            var extRegex = new RegExp(hbs.extname + "$");

            templates = Object.keys(templates).map((name) => {
                return {
                    name: name.replace(extRegex, ""),
                    template: templates[name],
                }
            });

            if(templates.length)
            {
                res.locals.templates = templates;
            }

            setImmediate(next);
        }).catch(next);
    }

    app.get("/", exposeTemplates, (req, res) => {
        renderTemplate(req, res, "index", {
            title: "Home"
        });
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
        renderTemplate(req, res, "autherror");
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
        renderTemplate(req, res, "commands", {md});
    });

    app.get("/stats", (req, res) => {
        const duration = client.getUptime();
        const members = client.guilds.cache.reduce((p, c) => p + c.memberCount, 0);
        const onlineMembers = client.guilds.cache.reduce((p, c) => p + c.members.cache.filter(member => member.presence.status != "offline").size, 0);
        const offlineMembers = client.guilds.cache.reduce((p, c) => p + c.members.cache.filter(member => member.presence.status == "offline").size, 0);
        const textChannels = client.channels.cache.filter(c => c.type === "text").size;
        const voiceChannels = client.channels.cache.filter(c => c.type === "voice").size;

        const guilds = client.guilds.cache.size;

        renderTemplate(req, res, "stats", {
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
            renderTemplate(req, res, "notfound", 
            {
                page: req.path.split("/")[1].toProperCase(),
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