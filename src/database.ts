import { Database } from "sqlite3";
import fs from "fs";
import { databaseUtils } from "./databaseUtils";

const bindsDatabaseFilePath = "./binds.sqlite";

export function createDbConnection() {
	if (fs.existsSync(bindsDatabaseFilePath)) {
		const db = new Database(bindsDatabaseFilePath);
		verifyBindsTableExistance(db);
		return db;
	} else {
		const db = new Database(bindsDatabaseFilePath, (error) => {
			if (error) {
				return console.error(error.message);
			}
			verifyBindsTableExistance(db);
		});
		console.log("Connection with SQLite has been established");
		return db;
	}
}

function verifyBindsTableExistance(db: Database) {
	db.exec(`
CREATE TABLE IF NOT EXISTS ${databaseUtils.BINDS_DATABASE_REF()} ( 
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 author VARCHAR (255) NOT NULL,
 text VARCHAR (255) NOT NULL
)
	`);
}
