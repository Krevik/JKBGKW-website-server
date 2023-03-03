import express, {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import cors from "cors";
import {
	getBindSuggestionsDatabase,
	getBindsDatabase,
} from "./database/databases";
import { bindsApi } from "./api/binds/bindsApi";
import { bindSuggestionsApi } from "./api/bindSuggestions/bindSuggestionsApi";
import { fetchingUtils } from "./utils/fetchingUtils";
import { steamApi } from "./api/binds/steamApi";

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

app.get("/api/greeting", (req, res) => {
	const name = req.query.name || "World";
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

const bindsApiRoutes = bindsApi(app, databasesCollection.bindsDatabase);

const bindSuggestionsApiRoutes = bindSuggestionsApi(
	app,
	databasesCollection.bindSuggestionsDatabase
);

const steamApiRoutes = steamApi(app);

app.post("/api/serverInfo", async (req, res) => {
	fetchingUtils.fetchWrapHandleErrors(
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

app.listen(SERVER_PORT, () =>
	console.log(`Server listening at port ${SERVER_PORT}`)
);
