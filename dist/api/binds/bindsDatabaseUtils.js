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
exports.bindsDatabaseUtils = void 0;
exports.bindsDatabaseUtils = {
    BINDS_DATABASE_REF: "binds",
    wrapDatabaseTaskRequest: (task, res) => {
        task
            .then((dbResponse) => {
            res.send(dbResponse);
        })
            .catch((error) => {
            console.log("Encountered error: " + error.message);
            res.status(403).send(error).end();
        });
    },
    addBind: (db, bindToAdd) => __awaiter(void 0, void 0, void 0, function* () {
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
                db.run(`INSERT INTO ${exports.bindsDatabaseUtils.BINDS_DATABASE_REF} (author, text) VALUES (?, ?)`, [bindToAdd.author, bindToAdd.text], function (err, rows) {
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
    updateBind: (db, bindUpdateData) => __awaiter(void 0, void 0, void 0, function* () {
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
                        db.exec(`UPDATE ${exports.bindsDatabaseUtils.BINDS_DATABASE_REF} SET author='${bindUpdateData.author}' WHERE id=${bindUpdateData.id}`);
                    bindUpdateData.text &&
                        db.exec(`UPDATE ${exports.bindsDatabaseUtils.BINDS_DATABASE_REF} SET text='${bindUpdateData.text}' WHERE id=${bindUpdateData.id}`);
                    resolve({ updatedBindID: bindUpdateData.id });
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }),
    deleteBind: (db, deleteBindData) => __awaiter(void 0, void 0, void 0, function* () {
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
                    db.exec(`DELETE FROM ${exports.bindsDatabaseUtils.BINDS_DATABASE_REF} WHERE id=${deleteBindData.id}`);
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
    getBinds: (db) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM ${exports.bindsDatabaseUtils.BINDS_DATABASE_REF}`, function (err, rows) {
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
        db.all(`SELECT * FROM ${exports.bindsDatabaseUtils.BINDS_DATABASE_REF} WHERE id=${bindID}`, function (error, rows) {
            if (error) {
                reject(error);
            }
            else {
                resolve(rows);
            }
        });
    });
});
