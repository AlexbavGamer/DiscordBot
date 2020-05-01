import { MaytrixXClient } from "../domain/MaytrixXClient";

import i18n from "i18n";
import path from "path";
let locales = ['en', 'pt-br'];

const start = (client : MaytrixXClient) => {
    if(client == null) throw new Error("Cant find client, try again later");

    i18n.configure({
        locales: locales,
        defaultLocale: "en",
        directory: __dirname + "/locales",
        logErrorFn: (msg) => {
            console.log(msg);
        },
        logDebugFn: (msg) => {
            console.log(msg);
        },
        logWarnFn: (msg) => {
            console.log(msg);
        },
        autoReload: true,
    });

    console.log(`Locale initialized!\nLocale Dir: ${path.join(__dirname, 'locales')}`);
};

export { start };