"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSuggestionsDatabaseUtils = void 0;
exports.bindSuggestionsDatabaseUtils = {
    BIND_SUGGESTIONS_DATABASE_REF: "bindSuggestions",
    addBindSuggestion: (db, bindToAdd) => __awaiter(void 0, void 0, void 0, function* () {
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
                db.run(`INSERT INTO ${exports.bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} (author, text, proposed_by) VALUES (?, ?, ?)`, [bindToAdd.author, bindToAdd.text, bindToAdd.proposedBy], function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve({ rows });
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }),
    deleteBindSuggestion: (db, deleteBindData) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            if (!deleteBindData) {
                reject("Couldn't delete bind, no deletion data was given");
            }
            if (!deleteBindData.id) {
                reject("No bind id was given");
            }
            findExistingBind(db, deleteBindData.id)
                .then((rows) => {
                if (rows.length > 0) {
                    db.exec(`DELETE FROM ${exports.bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} WHERE id=${deleteBindData.id}`);
                    resolve({
                        message: "Successfully deleted bind with id: " + deleteBindData.id,
                    });
                }
                else {
                    reject({ message: "Didn't find that bind" });
                }
            })
                .catch((error) => {
                reject(error);
            });
        });
    }),
    getBindSuggestions: (db) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM ${exports.bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF}`, function (err, rows) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }),
};
const findExistingBind = (db, bindID) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        db.all(`SELECT * FROM ${exports.bindSuggestionsDatabaseUtils.BIND_SUGGESTIONS_DATABASE_REF} WHERE id=${bindID}`, function (error, rows) {
            if (error) {
                reject(error);
            }
            else {
                resolve(rows);
            }
        });
    });
});
