import * as kue from 'kue';
import { config } from "dotenv";

config({path: __dirname + "/../src/.env"});

import { Client } from 'pg';
import app, { Initialize } from './app';

const { DATABASE_URL, REDIS_URL } = process.env;

console.log(`REDIS URL: ${REDIS_URL}`);
const PORT = process.env.PORT ?? 5000;

const start = async() => {
    try {
        const client = new Client({
            connectionString: DATABASE_URL,
        });
        const queue = kue.createQueue({
            prefix: 'q',
            redis: {
                port: 13362,
                host: 'redis-13362.c92.us-east-1-3.ec2.cloud.redislabs.com',
                auth: 'QjZpLE4stwM5OOP6BrtbKyoWnFpSaxpP',
                db: 3,
                options: {

                }
            }
        });

        await client.connect();
        Initialize(client, queue);
        app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
    } catch (error) {
        console.log(error);
    }
};
start();