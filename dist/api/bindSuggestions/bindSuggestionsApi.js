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
exports.bindSuggestionsApi = void 0;
const apiConstants_1 = require("../apiConstants");
const bindSuggestionsDatabaseUtils_1 = require("./bindSuggestionsDatabaseUtils");
const databaseUtils_1 = require("../../utils/databaseUtils");
const bindSuggestionsApi = (app, database) => {
    GET: app.get(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_SUGGESTIONS_PATH}/getBinds`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindSuggestionsDatabaseUtils_1.bindSuggestionsDatabaseUtils.getBindSuggestions(database), res);
    }));
    ADD: app.post(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_SUGGESTIONS_PATH}/addBind`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const bindToAdd = req.body;
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindSuggestionsDatabaseUtils_1.bindSuggestionsDatabaseUtils.addBindSuggestion(database, bindToAdd), res);
    }));
    DELETE: app.post(`${apiConstants_1.apiConstants.API_BASE_PATH}${apiConstants_1.apiConstants.BINDS_SUGGESTIONS_PATH}/deleteBind`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteBindData = req.body;
        console.log(deleteBindData);
        databaseUtils_1.databaseUtils.wrapDatabaseTaskRequest(bindSuggestionsDatabaseUtils_1.bindSuggestionsDatabaseUtils.deleteBindSuggestion(database, deleteBindData), res);
    }));
};
exports.bindSuggestionsApi = bindSuggestionsApi;
