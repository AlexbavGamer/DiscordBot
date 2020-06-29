import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { Collection, Team } from "discord.js";
import { inspect } from "util";
import { json } from "body-parser";

class ReadyEvent extends MaytrixXEvent
{
    constructor(client : MaytrixXClient)
    {
        super(client);
    }

    async run()
    {
        console.log(`Guildas: ${this.client.guilds.cache.size}\n` +
        `Canais de Texto: ${this.client.channels.cache.filter(c => c.type == "text").size}\n` +
        `Canais de Voz: ${this.client.channels.cache.filter(c => c.type == "voice").size}\n` +
        `Usuarios: ${this.client.users.cache.size}\n` +
        `Comandos: ${this.client.commands.size}\n` + 
        `Eventos: ${this.client.events.size}\n` + 
        `Prefixos: ${this.client.guilds.cache.map((guild) => {
            return this.client.getSettings(guild).prefix
        }).join(", ")}`);
        let teamApplication = <Team>this.client.application.owner!;
        if(this.client.owners.length < 1) teamApplication ? this.client.owners.push(teamApplication.members.keys()) : this.client.owners.push(this.client.application.owner?.id);
        setInterval(() => {
            this.client.owners = [];
            teamApplication ? this.client.owners.push(teamApplication.members.keys()) : this.client.owners.push(this.client.application.owner?.id);
        }, 60000);

        if(!this.client.settings.has("default"))
        {
            if(!this.client.config.defaultSettings) throw new Error("defaultSettings not present in MaytrixConfig.ts or settings database. Bot cant load.");
            this.client.settings.set("default", this.client.config.defaultSettings);
        }
        this.client.initSystems();
        console.log(`[Ready]: ${this.client.user?.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size}`);
    }
}

export default ReadyEvent;