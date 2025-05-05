import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "@repo/backend/config";

const wss = new WebSocketServer({ port: 8080 });

const checkUser = (token: string): string | null => {
	const decoded = jwt.verify(token, JWT as string);

	if (typeof decoded == "string") return null;

	if (!decoded || !decoded.userId) return null;

	return decoded.userId;
};

wss.on("connection", function connection(ws, request) {
	const url = request.url;
	if (!url) return;

	const queryParams = new URLSearchParams(url.split("?")[1]);
	const token = queryParams.get("token") || ""; //get the token that the user sent us in http and use it in ws

	const userId = checkUser(token); // make sure the token of the user is valid

	if (userId == null) {
		ws.close(); //if the token is invalid, close the connection
	}

	ws.on("message", function message(data) {
		console.log("received: %s", data);
		ws.send("pong");
	});
});
