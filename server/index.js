const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get("/api/greeting", (req, res) => {
	const name = req.query.name || "World";
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get("/api/serverInfo", (req, res) => {
	const data = new FormData();
	data.append("client_id", "26606");
	data.append("pin", "635577095f13a5c85545c4e6690d8878");
	data.append("server_id", "24044");
	fetch(
		"https://rec.liveserver.pl/api?channel=get_server_info&return_method=json",
		{
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},

			body: data.toString(),
		}
	).then((response) => {
		console.log("response" + JSON.stringify(response));
		res.send(response.json());
	});
});

app.listen(3001, () =>
	console.log("Express server is running on localhost:3001")
);
