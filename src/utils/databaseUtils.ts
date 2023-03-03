import { Response } from "express";

export const databaseUtils = {
	wrapDatabaseTaskRequest: (task: Promise<any>, res: Response) => {
		task
			.then((dbResponse) => {
				res.send(dbResponse);
			})
			.catch((error) => {
				console.log("Encountered error: " + error.message);
				res.status(403).end();
			});
	},
};
