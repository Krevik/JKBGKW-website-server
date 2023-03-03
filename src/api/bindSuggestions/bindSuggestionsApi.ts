import { Database } from "sqlite3";
import { apiConstants } from "../apiConstants";

export const bindSuggestionsApi = (
	app: any,
	databaseUtils: any,
	database: Database
) => {
	GET: app.get(
		`${apiConstants.API_BASE_PATH}${apiConstants.BINDS_SUGGESTIONS_PATH}/getBinds`,
		async (req: Request, res: Response) => {
			databaseUtils.wrapDatabaseTaskRequest(
				databaseUtils.getBinds(database),
				res
			);
		}
	);

	ADD: app.post(
		`${apiConstants.API_BASE_PATH}${apiConstants.BINDS_SUGGESTIONS_PATH}/addBind`,
		async (req: Request, res: Response) => {
			const bindToAdd = req.body;
			databaseUtils.wrapDatabaseTaskRequest(
				databaseUtils.addBind(database, bindToAdd),
				res
			);
		}
	);

	UPDATE: app.post(
		`${apiConstants.API_BASE_PATH}${apiConstants.BINDS_SUGGESTIONS_PATH}/updateBind`,
		async (req: Request, res: Response) => {
			const updateData = req.body;
			databaseUtils.wrapDatabaseTaskRequest(
				databaseUtils.updateBind(database, updateData),
				res
			);
		}
	);

	DELETE: app.post(
		`${apiConstants.API_BASE_PATH}${apiConstants.BINDS_SUGGESTIONS_PATH}/deleteBind`,
		async (req: Request, res: Response) => {
			const deleteBindData = req.body;
			console.log(deleteBindData);
			databaseUtils.wrapDatabaseTaskRequest(
				databaseUtils.deleteBind(database, deleteBindData),
				res
			);
		}
	);
};
