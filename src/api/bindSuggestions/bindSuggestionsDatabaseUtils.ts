import { Database } from "sqlite3";
import { BindData } from "../../utils/bindsModels";

export const bindSuggestionsDatabaseUtils = {
	BIND_SUGGESTIONS_DATABASE_REF: "bindSuggestions",
	addBind: async (
		db: Database,
		bindToAdd: { author: string; text: string }
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
					`INSERT INTO ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} (author, text) VALUES (?, ?)`,
					[bindToAdd.author, bindToAdd.text],
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
	updateBind: async (db: Database, bindUpdateData: BindData) => {
		return new Promise(function (resolve, reject) {
			if (!bindUpdateData.text && !bindUpdateData.author) {
				reject("No text nor author was given");
			}
			if (!bindUpdateData.id) {
				reject("No bind id was given");
			}
			try {
				findExistingBind(db, bindUpdateData.id)
					.then((existingBind) => {
						bindUpdateData.author &&
							db.exec(
								`UPDATE ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} SET author='${bindUpdateData.author}' WHERE id=${bindUpdateData.id}`
							);
						bindUpdateData.text &&
							db.exec(
								`UPDATE ${bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} SET text='${bindUpdateData.text}' WHERE id=${bindUpdateData.id}`
							);
						resolve({ updatedBindID: bindUpdateData.id });
					})
					.catch((error) => {
						reject(error);
					});
			} catch (error) {
				reject(error);
			}
		});
	},
	deleteBind: async (db: Database, deleteBindData: BindData) => {
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
	getBinds: async (db: Database) => {
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
