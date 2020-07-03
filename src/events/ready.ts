import { MaytrixXEvent } from "../domain/MaytrixXEvent";
import { MaytrixXClient } from "../domain/MaytrixXClient";
import { Collection, Team } from "discord.js";
import { inspect } from "util";
import { json } from "body-parser";
import { User } from "discord.js";

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

        if(this.client.application.owner instanceof Team)
        {
            if(this.client.application.owner.members.size < 1)
            {
                this.client.owners.push(this.client.application.owner.ownerID!);
            }
            else
            {
                this.client.owners.push(...this.client.application.owner.members.array().map(m => m.id));
            }
            setInterval(() => {
                this.client.owners = [];
                if(this.client.application.owner instanceof Team)
                {
                    if(this.client.application.owner.members.size > 1)
                    {
                        this.client.owners.push(...this.client.application.owner!.members.array().map(m => m.id));
                    }
                    else
                    {
                     this.client.owners.push(this.client.application.owner!.ownerID!);
                    }
                }
            }, 60000);
        }
        else if(this.client.application.owner instanceof User)
        {
            this.client.owners = [];
            this.client.owners.push(this.client.application.owner.id);
        }

        setInterval(() => {
            this.client.user?.setActivity({
                name: this.client.getRandomActivitie(),
                type: this.client.config.activitieType,
                url: this.client.config.activitieURL,
            });
        }, 2500);

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