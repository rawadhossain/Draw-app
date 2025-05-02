import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
	const url = request.url;
	if (!url) return;

	const queryParams = new URLSearchParams(url.split("?")[1]);
	const token = queryParams.get("token") || ""; //get the token that the user sent us in http and use it in ws
	const decoded = jwt.verify(token, JWT);

	// make sure the token of the user is valid
	if (!decoded || !(decoded as JwtPayload).userId) {
		ws.close(); //if the token is invalid, close the connection
		return;
	}

	ws.on("message", function message(data) {
		console.log("received: %s", data);
		ws.send("pong");
	});
});
