"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbConnection = void 0;
const sqlite3_1 = require("sqlite3");
const fs_1 = __importDefault(require("fs"));
const bindsDatabaseUtils_1 = require("./api/binds/bindsDatabaseUtils");
const bindsDatabaseFilePath = "./binds.sqlite";
function createDbConnection() {
    if (fs_1.default.existsSync(bindsDatabaseFilePath)) {
        const db = new sqlite3_1.Database(bindsDatabaseFilePath);
        verifyBindsTableExistance(db);
        return db;
    }
    else {
        const db = new sqlite3_1.Database(bindsDatabaseFilePath, (error) => {
            if (error) {
                return console.error(error.message);
            }
            verifyBindsTableExistance(db);
        });
        console.log("Connection with SQLite has been established");
        return db;
    }
}
exports.createDbConnection = createDbConnection;
function verifyBindsTableExistance(db) {
    db.exec(`
CREATE TABLE IF NOT EXISTS ${bindsDatabaseUtils_1.databaseUtils.BINDS_DATABASE_REF()} ( 
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 author VARCHAR (255) NOT NULL,
 text VARCHAR (255) NOT NULL
)
	`);
}
