const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const fetch = require("node-fetch");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const { URLSearchParams } = require("url");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors());

app.get("/api/greeting", (req, res) => {
	const name = req.query.name || "World";
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.options("/api/serverInfo", cors());
app.post("/api/serverInfo", cors(), async (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
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
	).then(async (response) => {
		console.log(response.text);
		const apiResponseJson = await response.json();
		res.send(apiResponseJson);
	});
});

app.options("/api/steamUserData", (req, res) => {
	res.setHeader("Content-Type", "application/json");
});

app.post("/api/steamUserData", async (req, res) => {
	res.setHeader("Content-Type", "application/json");
	const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;
	// @ts-ignore
	await fetch(fetchURL, {
		method: "get",
	})
		.then(async (response) => {
			const apiResponseJson = await response.json();
			res.send(apiResponseJson);
		})
		.catch((error) => {
			console.log("Got error while fetching :( " + error);
		});
});

https
	.createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
		{
			key: fs.readFileSync("key.pem"),
			cert: fs.readFileSync("cert.pem"),
		},
		app
	)
	.listen(3001, () => {
		console.log("serever is runing at port 3001");
	});

// app.listen(3001, () =>
// 	console.log("Express server is running on localhost:3001")
// );
