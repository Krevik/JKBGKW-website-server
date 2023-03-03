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
exports.bindsApi = void 0;
const apiConstants_1 = require("../apiConstants");
const databaseUtils_1 = require("../../utils/databaseUtils");
const bindsDatabaseUtils_1 = require("./bindsDatabaseUtils");
const bindsApi = (app, database) => {
    GET: app.get(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_BASE_PATH}/getBinds`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindsDatabaseUtils_1.bindsDatabaseUtils.getBinds(database), res);
    }));
    ADD: app.post(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_BASE_PATH}/addBind`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const bindToAdd = req.body;
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindsDatabaseUtils_1.bindsDatabaseUtils.addBind(database, bindToAdd), res);
    }));
    UPDATE: app.post(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_BASE_PATH}/updateBind`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = req.body;
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindsDatabaseUtils_1.bindsDatabaseUtils.updateBind(database, updateData), res);
    }));
    DELETE: app.post(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_BASE_PATH}/deleteBind`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteBindData = req.body;
        console.log(deleteBindData);
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindsDatabaseUtils_1.bindsDatabaseUtils.deleteBind(database, deleteBindData), res);
    }));
};
exports.bindsApi = bindsApi;
