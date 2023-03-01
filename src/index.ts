import express, {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import cors from "cors";
import { databaseUtils } from "./databaseUtils";
import { createDbConnection } from "./database";
import { DeleteBindData, UpdateBindData } from "./utils/bindsModels";
import { securityUtils } from "./utils/securityUtils";
import axios from "axios";

const app = express();
app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);

const corsOptions = {
	origin: "https://kether.pl",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(securityUtils.demandKetherOrigin);

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

const appDatabase = createDbConnection();

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

app.get("/api/getBinds", async (req, res) => {
	databaseUtils.wrapDatabaseTaskRequest(
		databaseUtils.getBinds(appDatabase),
		res
	);
});

app.post("/api/addBind", async (req, res) => {
	const bindToAdd = req.body;
	databaseUtils.wrapDatabaseTaskRequest(
		databaseUtils.addBind(appDatabase, bindToAdd),
		res
	);
});

app.post("/api/binds/updateBind", async (req, res) => {
	const updateData: UpdateBindData = req.body;
	databaseUtils.wrapDatabaseTaskRequest(
		databaseUtils.updateBind(appDatabase, updateData),
		res
	);
});

app.post("/api/binds/deleteBind", async (req, res) => {
	const deleteBindData: DeleteBindData = req.body;
	databaseUtils.wrapDatabaseTaskRequest(
		databaseUtils.deleteBind(appDatabase, deleteBindData),
		res
	);
});

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
