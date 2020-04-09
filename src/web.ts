import { MaytrixXWebPanel } from "./domain/MaytrixXWebPanel";

if(process.env.PORT === undefined)
{
    console.log("port is undefined");
}

if(global.__BOT__ === undefined)
{
    console.log("bot is undefined");
}
else
{
    global.__BOT_WEBPANEL__ = new MaytrixXWebPanel(global.__BOT__);
}
