import express from "express";
import jwt from "jsonwebtoken";
import { JWT } from "@repo/backend/config";
import { middleware } from "./middleware";
import { UserSchema } from "@repo/common/types";

const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
	res.json({
		userId: "123",
	});
});

app.post("/signin", (req, res) => {
	const userId = 1;
	const token = jwt.sign({ userId }, JWT as string); //generating a token linked with the userId.

	res.json({ token }); // sending back the token
});

app.post("/room", middleware, (req, res) => {
	res.json({
		roomId: 123,
	});
});

app.listen(3000);
