import { NextFunction, Request, Response } from "express";
import { JWT } from "@repo/backend/config";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
	const token = req.headers["authorization"] ?? "";
	const decoded = jwt.verify(token, JWT as string); // Cast to DecodedToken

	if (decoded) {
		//@ts-ignore
		req.userId = decoded.userId; // Now TypeScript knows userId is available
		next();
	} else {
		res.status(403).json({
			message: "Unauthorized",
		});
	}
}
