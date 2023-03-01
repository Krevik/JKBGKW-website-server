import { Database } from "sqlite3";
import { Response } from "express";
import { DeleteBindData, UpdateBindData } from "./utils/bindsModels";

export const databaseUtils = {
	BINDS_DATABASE_REF() {
		return `binds`;
	},
	wrapDatabaseTaskRequest: (task: Promise<any>, res: Response) => {
		task
			.then((dbResponse) => {
				res.send(dbResponse);
			})
			.catch((error) => {
				console.log("Encountered error: " + error.message);
				res.send({ error: "Couldn't do the task: " + error });
			});
	},
	addBind: async (db: Database, bindToAdd: { author: any; text: any }) => {
		return new Promise(function (resolve, reject) {
			if (!bindToAdd) {
				return reject("No bind was given");
			}
			if (!bindToAdd.author) {
				return reject("No author was given");
			}
			if (!bindToAdd.text) {
				return reject("No text was given");
			}
			try {
				db.run(
					`INSERT INTO ${databaseUtils.BINDS_DATABASE_REF()} (author, text) VALUES (?, ?)`,
					[bindToAdd.author, bindToAdd.text],
					function (err: any, rows: unknown) {
						if (err) {
							return reject(err);
						}
						resolve("Added");
					}
				);
			} catch (error) {
				return reject(error);
			}
		});
	},
	updateBind: async (db: Database, bindUpdateData: UpdateBindData) => {
		return new Promise(function (resolve, reject) {
			if (!bindUpdateData.text && !bindUpdateData.author) {
				return reject("No text nor author was given");
			}
			if (!bindUpdateData.id) {
				return reject("No bind id was given");
			}
			try {
				findExistingBind(db, bindUpdateData.id)
					.then(() => {
						bindUpdateData.author &&
							db.exec(
								`UPDATE ${databaseUtils.BINDS_DATABASE_REF()} SET author='${
									bindUpdateData.author
								}' WHERE id=${bindUpdateData.id}`
							);
						bindUpdateData.text &&
							db.exec(
								`UPDATE ${databaseUtils.BINDS_DATABASE_REF()} SET text='${
									bindUpdateData.text
								}' WHERE id=${bindUpdateData.id}`
							);
						return resolve("Updated");
					})
					.catch((error) => {
						return reject(error);
					});
			} catch (error) {
				return reject(error);
			}
		});
	},
	deleteBind: async (db: Database, deleteBindData: DeleteBindData) => {
		return new Promise(function (resolve, reject) {
			if (!deleteBindData) {
				return reject("Couldn't delete bind, no deletion data was given");
			}
			if (!deleteBindData.id) {
				return reject("No bind id was given");
			}
			findExistingBind(db, deleteBindData.id)
				.then((rows) => {
					db.exec(
						`DELETE FROM ${databaseUtils.BINDS_DATABASE_REF()} WHERE id=${
							deleteBindData.id
						}`
					);
					return resolve(
						"Successfully deleted bind with id: " + deleteBindData.id
					);
				})
				.catch((error) => {
					return reject(error);
				});
		});
	},
	getBinds: async (db: Database) => {
		return new Promise(function (resolve, reject) {
			db.all(
				`SELECT * FROM ${databaseUtils.BINDS_DATABASE_REF()}`,
				function (err: any, rows: unknown) {
					if (err) {
						return reject(err);
					}
					resolve(rows);
				}
			);
		});
	},
};

const findExistingBind = async (db: Database, bindID: number) => {
	return new Promise(function (resolve, reject) {
		db.all(
			`SELECT * FROM ${databaseUtils.BINDS_DATABASE_REF()} WHERE id=${bindID}`,
			function (error: Error | null, rows: []) {
				if (rows.length > 0) {
					return resolve(rows.length);
				}
				return reject("No bind was found!");
			}
		);
	});
};
