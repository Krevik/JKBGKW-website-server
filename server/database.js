const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const bindsDatabaseFilePath = "./binds.db";

const BINDS_DATABASE_REF = "binds";

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
  CREATE TABLE ${BINDS_DATABASE_REF}
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    author VARCHAR(50) NOT NULL,
    text VARCHAR(50) NOT NULL
  );
`);
}

const addBind = (db, bind) => {
	db.run(
		`INSERT INTO ${BINDS_DATABASE_REF} (author, text) VALUES (?, ?)`,
		[bind.author, bind.text],
		function (error) {
			if (error) {
				console.error(error.message);
				return error.message;
			}
			const message = `Inserted a row with the ID: ${this.lastID}`;
			console.log(message);
			return message;
		}
	);
};

const getBinds = (db) => {
	db.each(`SELECT * FROM ${BINDS_DATABASE_REF}`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		console.log(row);
	});
};

module.exports = { createDbConnection, getBinds, addBind };
