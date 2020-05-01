import express from 'express';

//session packages
import passport from "passport";
import { Strategy } from "passport-discord";
import session from "express-session";
const SQLiteStore = require("connect-sqlite3")(session);

import wds from './wds';
import ssr from './ssr';
import { MaytrixXClient } from '../../domain/MaytrixXClient';
import Helmet from 'helmet';

if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'production';
}

export const setup = (client : MaytrixXClient) => {
	const isDevelopment = process.env.NODE_ENV === 'development';

	global.__CLIENT__ = false;
	global.__SERVER__ = true;
	global.__DEV__ = isDevelopment;
	global.__TEST__ = false;

	const config = require('../../../config')(process.env.NODE_ENV) as {
		PORT: number,
		PUBLIC_PATH: string;
		PUBLIC_FOLDER: string;
		SRC_FOLDER: string;
		SRC_CLIENT_FOLDER: string;
	}
	const app = express();


	if (isDevelopment) {
		wds(app);
	} else {
		app.use(config.PUBLIC_PATH, express.static(config.PUBLIC_FOLDER));
	}

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use(new Strategy({
		clientID: client.application.id,
		clientSecret: client.config.dashboard.oauthSecret,
		callbackURL: client.config.dashboard.callbackURL,
		scope: ["identify", "guild"]
	}, (accessToken, refreshToken, profile, done) => {
		process.nextTick(() => done(null, profile));
	}));

	app.use(session({
		store: new SQLiteStore({
			dir: './data'
		}),
		secret: client.config.dashboard.sessionSecret,
		resave: false,
		saveUninitialized: false
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(Helmet());

	app.get('*', (req, res, next) => {
		ssr(client, req, res, next);
	});

	app.locals.domain = client.config.dashboard.domain;

	app.listen(config.PORT, (err : any) => {
		if (err) {
		throw err;
		}

		console.log('===> Starting Server . . .');
		console.log('===> Port: ' + config.PORT);
		console.log('===> Public Dir: ' + config.PUBLIC_FOLDER);
		console.log('===> Environment: ' + process.env.NODE_ENV, ', isDevelopment', isDevelopment);
	});
};