import express, {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import cors from "cors";
import { bindsDatabaseUtils } from "./api/binds/bindsDatabaseUtils";
import {
	getBindSuggestionsDatabase,
	getBindsDatabase,
} from "./database/databases";
import axios from "axios";
import { bindsApi } from "./api/binds/bindsApi";
import { bindSuggestionsApi } from "./api/bindSuggestions/bindSuggestionsApi";
import { bindSuggestionsDatabaseUtils } from "./api/bindSuggestions/bindSuggestionsDatabaseUtils";

const app = express();
const databasesCollection = {
	bindsDatabase: getBindsDatabase(),
	bindSuggestionsDatabase: getBindSuggestionsDatabase(),
};

app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);

const corsOptions = {
	origin: "https://kether.pl",
};

app.use(cors(corsOptions));

const setDefaultCorsHeaders = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.setHeader("Access-Control-Allow-Origin", "https://kether.pl");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	next();
};
app.use(setDefaultCorsHeaders);

const logRequest = (req: Request, res: Response, next: NextFunction) => {
	console.log(`\x1b[33mProcessing request: ${req.originalUrl} \x1b[0m`);
	next();
};
app.use(logRequest);

app.get("/", (req: Request, res: Response): void => {
	try {
		res.send("Hello World");
	} catch (error) {
		res.send("Error");
	}
});

const SERVER_PORT = 3001;

const fetchWrapHandleErrors = (
	request: string,
	options: {
		method: "post" | "get" | "update";
		headers?: any;
		body?: URLSearchParams;
	},
	res: Response
) => {
	axios
		.request({
			url: request,
			method: options.method,
			data: options.body,
			headers: options.headers,
		})
		.catch((error) => {
			console.log(
				`Failed fetching: ${JSON.stringify(
					request
				)} with options ${JSON.stringify(options)}`
			);
			console.log(`Error: ${JSON.stringify(error)}`);
		})
		.then((response: any) => {
			const jsonedResponse = response.data;
			res.send(jsonedResponse);
		});
};

app.get("/api/greeting", (req, res) => {
	const name = req.query.name || "World";
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

const bindsApiRoutes = bindsApi(app, databasesCollection.bindsDatabase);

const bindSuggestionsApiRouters = bindSuggestionsApi(
	app,
	databasesCollection.bindSuggestionsDatabase
);

app.post("/api/serverInfo", async (req, res) => {
	fetchWrapHandleErrors(
		"https://rec.liveserver.pl/api?channel=get_server_info&return_method=json",
		{
			method: "post",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
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

app.options("/api/steamUserData", (req, res) => {
	res.setHeader("Content-Type", "application/json");
});

app.post("/api/steamUserData", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;

	fetchWrapHandleErrors(
		fetchURL,
		{
			method: "get",
		},
		res
	);
});

app.options("/api/steam/games", (req, res) => {
	res.setHeader("Content-Type", "application/json");
});

app.post("/api/steam/games", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const fetchURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamid=${req.body.userID}&format=json&include_appinfo=true`;

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
