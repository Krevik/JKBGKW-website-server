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
Object.defineProperty(exports, "__esModule", { value: true });
exports.steamApi = void 0;
const fetchingUtils_1 = require("../../utils/fetchingUtils");
const steamApi = (app) => {
    app.options("/api/steam/userData", (req, res) => {
        res.setHeader("Content-Type", "application/json");
    });
    app.post("/api/steam/userData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader("Content-Type", "application/json");
        const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;
        fetchingUtils_1.fetchingUtils.fetchWrapHandleErrors(fetchURL, {
            method: "get",
        }, res);
    }));
    app.options("/api/steam/games", (req, res) => {
        res.setHeader("Content-Type", "application/json");
    });
    app.post("/api/steam/games", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader("Content-Type", "application/json");
        const fetchURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamid=${req.body.userID}&format=json&include_appinfo=true`;
        fetchingUtils_1.fetchingUtils.fetchWrapHandleErrors(fetchURL, {
            method: "get",
        }, res);
    }));
};
exports.steamApi = steamApi;
