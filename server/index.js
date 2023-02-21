const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get("/api/greeting", (req, res) => {
	const name = req.query.name || "World";
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get("/api/serverInfo", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	fetch(
		"https://rec.liveserver.pl/api?channel=get_server_info&return_method=json&client_id=26606&pin=635577095f13a5c85545c4e6690d8878&server_id=24044",
		{
			method: "post",
		}
	).then((response) => {
		console.log("response" + JSON.stringify(response));
		res.send(response);
	});
});

app.listen(3001, () =>
	console.log("Express server is running on localhost:3001")
);
