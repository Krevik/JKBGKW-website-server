"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseUtils = void 0;
exports.databaseUtils = {
    wrapDatabaseTaskRequest: (task, res) => {
        task
            .then((dbResponse) => {
            res.send(dbResponse);
        })
            .catch((error) => {
            console.log("Encountered error: " + error.message);
            res.status(403).end();
        });
    },
};
