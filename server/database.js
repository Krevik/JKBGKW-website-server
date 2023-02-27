const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const databaseUtils = require("./databaseUtils");
const bindsDatabaseFilePath = "./binds.db";

function createDbConnection() {
	if (fs.existsSync(bindsDatabaseFilePath)) {
		return new sqlite3.Database(bindsDatabaseFilePath);
	} else {
		const db = new sqlite3.Database(bindsDatabaseFilePath, (error) => {
			if (error) {
				return console.error(error.message);
			}
			createTable(db);
		});
		console.log("Connection with SQLite has been established");
		return db;
	}
}

function createTable(db) {
	db.exec(`
  CREATE TABLE ${databaseUtils.BINDS_DATABASE_REF}
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    author VARCHAR(50) NOT NULL,
    text VARCHAR(50) NOT NULL,
	unique (text)
  );
`);
}

module.exports = createDbConnection();
