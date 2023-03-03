"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bindsDatabaseUtils_1 = require("./api/binds/bindsDatabaseUtils");
const databases_1 = require("./database/databases");
const axios_1 = __importDefault(require("axios"));
const bindsApi_1 = require("./api/binds/bindsApi");
const bindSuggestionsApi_1 = require("./api/bindSuggestions/bindSuggestionsApi");
const bindSuggestionsDatabaseUtils_1 = require("./api/bindSuggestions/bindSuggestionsDatabaseUtils");
const app = (0, express_1.default)();
const databasesCollection = {
    bindsDatabase: (0, databases_1.getBindsDatabase)(),
    bindSuggestionsDatabase: (0, databases_1.getBindSuggestionsDatabase)(),
};
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const corsOptions = {
    origin: "https://kether.pl",
};
app.use((0, cors_1.default)(corsOptions));
const setDefaultCorsHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://kether.pl");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    next();
};
app.use(setDefaultCorsHeaders);
const logRequest = (req, res, next) => {
    console.log(`\x1b[33mProcessing request: ${req.originalUrl} \x1b[0m`);
    next();
};
app.use(logRequest);
app.get("/", (req, res) => {
    try {
        res.send("Hello World");
    }
    catch (error) {
        res.send("Error");
    }
});
const SERVER_PORT = 3001;
const fetchWrapHandleErrors = (request, options, res) => {
    axios_1.default
        .request({
        url: request,
        method: options.method,
        data: options.body,
        headers: options.headers,
    })
        .catch((error) => {
        console.log(`Failed fetching: ${JSON.stringify(request)} with options ${JSON.stringify(options)}`);
        console.log(`Error: ${JSON.stringify(error)}`);
    })
        .then((response) => {
        const jsonedResponse = response.data;
        res.send(jsonedResponse);
    });
};
app.get("/api/greeting", (req, res) => {
    const name = req.query.name || "World";
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});
const bindsApiRoutes = (0, bindsApi_1.bindsApi)(app, bindsDatabaseUtils_1.bindsDatabaseUtils, databasesCollection.bindsDatabase);
const bindSuggestionsApiRouters = (0, bindSuggestionsApi_1.bindSuggestionsApi)(app, bindSuggestionsDatabaseUtils_1.bindSuggestionsDatabaseUtils, databasesCollection.bindSuggestionsDatabase);
app.post("/api/serverInfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fetchWrapHandleErrors("https://rec.liveserver.pl/api?channel=get_server_info&return_method=json", {
        method: "post",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: "26606",
            pin: "635577095f13a5c85545c4e6690d8878",
            server_id: "24044",
        }),
    }, res);
}));
app.options("/api/steamUserData", (req, res) => {
    res.setHeader("Content-Type", "application/json");
});
app.post("/api/steamUserData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;
    fetchWrapHandleErrors(fetchURL, {
        method: "get",
    }, res);
}));
app.options("/api/steam/games", (req, res) => {
    res.setHeader("Content-Type", "application/json");
});
app.post("/api/steam/games", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    const fetchURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamid=${req.body.userID}&format=json&include_appinfo=true`;
    fetchWrapHandleErrors(fetchURL, {
        method: "get",
    }, res);
}));
app.listen(SERVER_PORT, () => console.log(`Server listening at port ${SERVER_PORT}`));
