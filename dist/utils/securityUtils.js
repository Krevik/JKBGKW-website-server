"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityUtils = void 0;
exports.securityUtils = {
    ALLOWED_ORIGINS: ["https://kether.pl", "localhost"],
    demandKetherOrigin: (req, res, next) => {
        //TODO verify if header origin is contained in allowed origins
        next();
    },
};
