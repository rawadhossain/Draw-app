import express from "express";
import jwt from "jsonwebtoken";
import { JWT } from "@repo/backend/config";
import { middleware } from "./middleware.js";
import prisma from "@repo/db/client";
import { UserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/src/types";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	const parsedData = UserSchema.safeParse(req.body);

	if (!parsedData.success) {
		console.log(parsedData.error.format()); // structured error logging
		res.status(400).json({
			message: "Invalid input",
			errors: parsedData.error.flatten().fieldErrors,
		});
		return;
	}

	const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				name: parsedData.data.name,
				email: parsedData.data?.email,
				password: hashedPassword,
			},
		});

		res.json({
			userId: user.id,
		});
	} catch (error) {
		res.status(411).json({
			message: "User already exists with this username",
		});
	}
});

app.post("/signin", async (req, res) => {
	const parsedData = SigninSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: "Invalid input",
			errors: parsedData.error.flatten().fieldErrors,
		});
		return;
	}

	const user = await prisma.user.findUnique({
		where: {
			email: parsedData.data.email,
		},
	});

	if (!user || !(await bcrypt.compare(parsedData.data.password, user.password))) {
		res.status(401).json({ error: "Invalid credentials" });
		return;
	}

	const token = jwt.sign({ userId: user?.id }, JWT as string); //generating a token linked with the userId.

	res.json({ token }); // sending back the token
});

app.post("/room", middleware, async (req, res) => {
	const parsedData = CreateRoomSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: "Invalid input",
			errors: parsedData.error.flatten().fieldErrors,
		});
		return;
	}

	// @ts-ignore: TODO: Fix this
	const userId = req.userId;

	try {
		const room = await prisma.room.create({
			data: {
				slug: parsedData.data.name,
				adminId: userId,
			},
		});

		res.json({
			roomId: room.id,
		});
	} catch (e) {
		res.status(411).json({
			message: "Room already exists with this name",
		});
	}
});

app.listen(3001);
