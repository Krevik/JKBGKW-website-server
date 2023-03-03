"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchingUtils = void 0;
const axios_1 = __importDefault(require("axios"));
exports.fetchingUtils = {
    fetchWrapHandleErrors: (request, options, res) => {
        axios_1.default
            .request({
            url: request,
            method: options.method,
            data: options.body,
            headers: options.headers,
        })
            .catch((error) => {
            console.log(`Failed fetching: ${JSON.stringify(request)} with options ${JSON.stringify(options)}`);
            console.log(`Error: ${JSON.stringify(error)}`);
        })
            .then((response) => {
            const jsonedResponse = response.data;
            res.send(jsonedResponse);
        });
    },
};
