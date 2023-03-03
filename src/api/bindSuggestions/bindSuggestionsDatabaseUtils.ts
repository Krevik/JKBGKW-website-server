import { Database } from "sqlite3";
import { BindData } from "../../utils/bindsModels";

export const bindSuggestionsDatabaseUtils = {
	BIND_SUGGESTIONS_DATABASE_REF: "bindSuggestions",
	addBindSuggestion: async (
		db: Database,
		bindToAdd: { author: string; text: string; proposedBy: string }
	) => {
		return new Promise(function (resolve, reject) {
			if (!bindToAdd) {
				reject("No bind was given");
			}
			if (!bindToAdd.author) {
				reject("No author was given");
			}
			if (!bindToAdd.text) {
				reject("No text was given");
			}
			try {
				db.run(
					`INSERT INTO ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} (author, text, proposed_by) VALUES (?, ?, ?)`,
					[bindToAdd.author, bindToAdd.text, bindToAdd.proposedBy],
					function (err: any, rows: unknown) {
						if (err) {
							reject(err);
						}
						resolve({ rows });
					}
				);
			} catch (error) {
				reject(error);
			}
		});
	},
	deleteBindSuggestion: async (db: Database, deleteBindData: BindData) => {
		return new Promise(function (resolve, reject) {
			if (!deleteBindData) {
				reject("Couldn't delete bind, no deletion data was given");
			}
			if (!deleteBindData.id) {
				reject("No bind id was given");
			}
			findExistingBind(db, deleteBindData.id)
				.then((rows) => {
					if ((rows as []).length > 0) {
						db.exec(
							`DELETE FROM ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} WHERE id=${deleteBindData.id}`
						);
						resolve({
							message:
								"Successfully deleted bind with id: " + deleteBindData.id,
						});
					} else {
						reject({ message: "Didn't find that bind" });
					}
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	getBindSuggestions: async (db: Database) => {
		return new Promise(function (resolve, reject) {
			db.all(
				`SELECT * FROM ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF}`,
				function (err: any, rows: []) {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	},
};

const findExistingBind = async (db: Database, bindID: number) => {
	return new Promise(function (resolve, reject) {
		db.all(
			`SELECT * FROM ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} WHERE id=${bindID}`,
			function (error: Error | null, rows: []) {
				if (error) {
					reject(error);
				} else {
					resolve(rows);
				}
			}
		);
	});
};
