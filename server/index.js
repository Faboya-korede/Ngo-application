'use strict';

// listing all imports
let express = require('express');
let cookieParser = require('cookie-parser');
let requireDir = require('require-dir');
let routes = requireDir('./routes');
let auth = require('./middleware/auth');
let MongoClient = require('mongodb').MongoClient;
//let mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();

// connect to db
//mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/ngodb?authSource=admin', {
//	useNewUrlParser: true,
//	useUnifiedTopology: true
//}).then(
//	() => console.log(chalk.yellow('Connected to mongo database at bukola.xyz')),
//	err => console.log(chalk.red(err))
//);

//connect to db 
// use when starting application locally with node command
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as a separate docker container
let mongoUrlDocker = "mongodb://admin:password@host.docker.internal:27017";

// use when starting application as docker container, part of docker-compose
let mongoUrlDockerCompose = "mongodb://admin:password@mongodb";

let mongoUrlK8s = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/ngodb?authSource=admin`

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

MongoClient.connect(mongoUrlK8s, mongoClientOptions, function (err, client) {
    if (err) throw err;

// express setup
let app = express();
app.set('port', 8080);
app.use(express.static(__dirname + '/public')); // css and js
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
		if (!req.cookies.ngotok) return next();
		auth.direct(res, next, req.cookies.ngotok);
	},
	(req, res) => {
		console.log(chalk.green('GET ' + chalk.blue('/')));
		res.render('index.ejs');
	});

for (let route in routes)
	app.use('/' + route, routes[route]);

app.get('/logout', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/logout')));
	res.clearCookie('ngotok');
	res.redirect('/');
});

app.use((req, res, next) => {
	console.log(chalk.yellow('Undefined route: ' + req.method + ' ' + req.originalUrl));
	res.status(404).render('404.ejs');
});

module.exports = app;
