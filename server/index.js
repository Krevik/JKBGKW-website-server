const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const fetch = require("node-fetch");
const cors = require("cors");
const http = require("http");
const fs = require("fs");
const { URLSearchParams } = require("url");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors());

var corsOptions = {
	origin: "http://kether.pl",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const setDefaultCorsHeaders = (res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
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

app.post("/api/serverInfo", cors(corsOptions), async (req, res) => {
	setDefaultCorsHeaders(res);

	// @ts-ignore
	await fetch(
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
		}
	)
		.then(async (response) => {
			const responseJSONED = await response.json();
			res.send(responseJSONED);
		})
		.catch((error) => {
			res.send("Couldn't fetch");
		});
});

app.options("/api/steamUserData", cors(corsOptions), (req, res) => {
	res.setHeader("Content-Type", "application/json");
	setDefaultCorsHeaders(res);
});

app.post("/api/steamUserData", cors(corsOptions), async (req, res) => {
	res.setHeader("Content-Type", "application/json");
	setDefaultCorsHeaders(res);

	const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;
	// @ts-ignore
	await fetch(fetchURL, {
		method: "get",
	})
		.then(async (response) => {
			const responseJSONED = await response.json();
			res.send(responseJSONED);
		})
		.catch((error) => {
			res.send("Couldn't fetch");
		});
});

app.listen(3001, () => console.log("Server listening at port 3001"));
