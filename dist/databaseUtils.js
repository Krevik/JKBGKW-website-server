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
exports.databaseUtils = void 0;
exports.databaseUtils = {
    BINDS_DATABASE_REF() {
        return `binds`;
    },
    wrapDatabaseTaskRequest: (task, res) => {
        task
            .then((dbResponse) => {
            res.send(dbResponse);
        })
            .catch((error) => {
            console.log("Encountered error: " + error.message);
            res.send({ error: "Couldn't do the task: " + error });
        });
    },
    addBind: (db, bindToAdd) => __awaiter(void 0, void 0, void 0, function* () {
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
                db.run(`INSERT INTO ${exports.databaseUtils.BINDS_DATABASE_REF()} (author, text) VALUES (?, ?)`, [bindToAdd.author, bindToAdd.text], function (err, rows) {
                    if (err) {
                        return reject(err);
                    }
                    resolve("Added");
                });
            }
            catch (error) {
                return reject(error);
            }
        });
    }),
    updateBind: (db, bindUpdateData) => __awaiter(void 0, void 0, void 0, function* () {
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
                        db.exec(`UPDATE ${exports.databaseUtils.BINDS_DATABASE_REF()} SET author='${bindUpdateData.author}' WHERE id=${bindUpdateData.id}`);
                    bindUpdateData.text &&
                        db.exec(`UPDATE ${exports.databaseUtils.BINDS_DATABASE_REF()} SET text='${bindUpdateData.text}' WHERE id=${bindUpdateData.id}`);
                    return resolve("Updated");
                })
                    .catch((error) => {
                    return reject(error);
                });
            }
            catch (error) {
                return reject(error);
            }
        });
    }),
    deleteBind: (db, deleteBindData) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            if (!deleteBindData) {
                return reject("Couldn't delete bind, no deletion data was given");
            }
            if (!deleteBindData.id) {
                return reject("No bind id was given");
            }
            findExistingBind(db, deleteBindData.id)
                .then((rows) => {
                db.exec(`DELETE FROM ${exports.databaseUtils.BINDS_DATABASE_REF()} WHERE id=${deleteBindData.id}`);
                return resolve("Successfully deleted bind with id: " + deleteBindData.id);
            })
                .catch((error) => {
                return reject(error);
            });
        });
    }),
    getBinds: (db) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM ${exports.databaseUtils.BINDS_DATABASE_REF()}`, function (err, rows) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }),
};
const findExistingBind = (db, bindID) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        db.all(`SELECT * FROM ${exports.databaseUtils.BINDS_DATABASE_REF()} WHERE id=${bindID}`, function (error, rows) {
            if (rows.length > 0) {
                return resolve(rows.length);
            }
            return reject("No bind was found!");
        });
    });
});
