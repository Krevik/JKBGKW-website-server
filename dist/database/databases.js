"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBindSuggestionsDatabase = exports.getBindsDatabase = void 0;
const sqlite3_1 = require("sqlite3");
const fs_1 = __importDefault(require("fs"));
const bindsDatabaseUtils_1 = require("../api/binds/bindsDatabaseUtils");
const bindSuggestionsDatabaseUtils_1 = require("../api/bindSuggestions/bindSuggestionsDatabaseUtils");
const bindsDatabaseFilePath = "./binds.sqlite";
const bindSuggestionsDatabaseFilePath = "./bindSuggestions.sqlite";
const establishDBConnection = (databaseFileLoc, establisherFunction) => {
    if (fs_1.default.existsSync(databaseFileLoc)) {
        const db = new sqlite3_1.Database(databaseFileLoc);
        establisherFunction(db);
        return db;
    }
    else {
        const db = new sqlite3_1.Database(databaseFileLoc, (error) => {
            if (error) {
                return console.error(error.message);
            }
            establisherFunction(db);
        });
        console.log(`Connection with SQLite for ${databaseFileLoc} has been established`);
        return db;
    }
};
function verifyBindsTableExistance(db) {
    db.exec(`
CREATE TABLE IF NOT EXISTS ${bindsDatabaseUtils_1.bindsDatabaseUtils.BINDS_DATABASE_REF} ( 
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 author VARCHAR (255) NOT NULL,
 text VARCHAR (255) NOT NULL
)
	`);
}
function verifyBindSuggestionsTableExistance(db) {
    db.exec(`
CREATE TABLE IF NOT EXISTS ${bindSuggestionsDatabaseUtils_1.bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} ( 
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 author VARCHAR (255) NOT NULL,
 text VARCHAR (255) NOT NULL
)
	`);
}
const getBindsDatabase = () => {
    return establishDBConnection(bindsDatabaseFilePath, verifyBindsTableExistance);
};
exports.getBindsDatabase = getBindsDatabase;
const getBindSuggestionsDatabase = () => {
    return establishDBConnection(bindSuggestionsDatabaseFilePath, verifyBindSuggestionsTableExistance);
};
exports.getBindSuggestionsDatabase = getBindSuggestionsDatabase;
