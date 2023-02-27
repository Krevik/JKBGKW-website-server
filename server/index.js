const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const fetch = require("node-fetch");
const cors = require("cors");
const http = require("http");
const fs = require("fs");
const { URLSearchParams } = require("url");
const appDatabase = require("./database");
const databaseUtils = require("./databaseUtils");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors());

const SERVER_PORT = 3001;

const corsOptions = {
	origin: "http://kether.pl",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const setDefaultCorsHeaders = (res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
};

const fetchWrapHandleErrors = (request, options, res) => {
	// @ts-ignore
	fetch(request, options)
		.catch((error) => {
			console.log(
				`Failed fetching: ${JSON.stringify(
					request
				)} with options ${JSON.stringify(options)}`
			);
			console.log(`Error: ${JSON.stringify(error)}`);
		})
		.then(async (response) => {
			const jsonedResponse = await response.json();
			res.send(jsonedResponse);
		});
};

app.get("/api/greeting", (req, res) => {
	const name = req.query.name || "World";
	res.setHeader("Content-Type", "application/json");
	setDefaultCorsHeaders(res);
	res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.options("/api/serverInfo", cors(corsOptions), (req, res) => {
	setDefaultCorsHeaders(res);
});

app.get("/api/getBinds", cors(corsOptions), async (req, res) => {
	setDefaultCorsHeaders(res);
	databaseUtils.getBinds(appDatabase).then((dbResponse) => {
		res.send(dbResponse);
	});
});

app.post("/api/addBind", cors(corsOptions), async (req, res) => {
	console.log("Trying to add following bind: ");
	const bindToAdd = req.body;
	console.log(bindToAdd);
	databaseUtils.addBind(appDatabase, bindToAdd).then((dbAnswer) => {
		res.send(dbAnswer);
	});
});

app.post("/api/serverInfo", cors(corsOptions), async (req, res) => {
	setDefaultCorsHeaders(res);

	fetchWrapHandleErrors(
		"https://rec.liveserver.pl/api?channel=get_server_info&return_method=json",
		{
			method: "post",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			body: new URLSearchParams({
				client_id: "26606",
				pin: "635577095f13a5c85545c4e6690d8878",
				server_id: "24044",
			}),
		},
		res
	);
});

app.options("/api/steamUserData", cors(corsOptions), (req, res) => {
	res.setHeader("Content-Type", "application/json");
	setDefaultCorsHeaders(res);
});

app.post("/api/steamUserData", cors(corsOptions), async (req, res) => {
	res.setHeader("Content-Type", "application/json");
	setDefaultCorsHeaders(res);

	const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;

	fetchWrapHandleErrors(
		fetchURL,
		{
			method: "get",
		},
		res
	);
});

app.listen(SERVER_PORT, () =>
	console.log(`Server listening at port ${SERVER_PORT}`)
);
