import * as express from "express";
import { MaytrixXClient } from "./MaytrixXClient";

class MaytrixXWebPanel
{
    private readonly _app : express.Application;
    private readonly _bot : MaytrixXClient;
    public get app()
    {
        return this._app;
    }
    public get bot()
    {
        return this._bot;
    }

    constructor(bot : MaytrixXClient)
    {
        this._bot = bot;
        this._app = express();
        this._app.listen(process.env.PORT);

        this._app.get("/", (req, res) => {
            res.send("Nada para ver aqui");
        });
    }
}
export { MaytrixXWebPanel }