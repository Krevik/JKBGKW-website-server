import { Request, Response } from "express";
import { fetchingUtils } from "../../utils/fetchingUtils";

export const steamApi = (app: any) => {
	app.options("/api/steam/userData", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
	});

	app.post("/api/steam/userData", async (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");

		const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamids=${req.body.userID}`;

		fetchingUtils.fetchWrapHandleErrors(
			fetchURL,
			{
				method: "get",
			},
			res
		);
	});

	app.options("/api/steam/games", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
	});

	app.post("/api/steam/games", async (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");

		const fetchURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F9B6127DDEB6AF27EA0D64F1E5C642A4&steamid=${req.body.userID}&format=json&include_appinfo=true`;

		fetchingUtils.fetchWrapHandleErrors(
			fetchURL,
			{
				method: "get",
			},
			res
		);
	});
};
