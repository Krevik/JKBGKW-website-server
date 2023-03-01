import expressPinoLogger from "express-pino-logger";

export const logRequest = expressPinoLogger({
	name: "kether.pl-website-server",
	level: "debug",
});
