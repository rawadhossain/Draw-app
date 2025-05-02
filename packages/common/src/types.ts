import { z } from "zod";

export const UserSchema = z.object({
	name: z.string().min(3),
	username: z.string().min(3),
	password: z.string(),
});

export const SigninSchema = z.object({
	username: z.string().min(3),
	password: z.string(),
});

export const CreateRoomSchema = z.object({
	name: z.string().min(3).max(20),
});
