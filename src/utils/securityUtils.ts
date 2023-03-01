import { NextFunction } from "express";

export const securityUtils = {
	ALLOWED_ORIGINS: ["https://kether.pl", "localhost"],
	demandKetherOrigin: (req: { headers: any }, res: any, next: () => void) => {
		//TODO verify if header origin is contained in allowed origins
		next();
	},
};
