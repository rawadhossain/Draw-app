import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
	| {
			type: "rect";
			x: number;
			y: number;
			width: number;
			height: number;
	  }
	| {
			type: "circle";
			centerX: number;
			centerY: number;
			radius: number;
	  }
	| {
			type: "pencil";
			startX: number;
			startY: number;
			endX: number;
			endY: number;
	  };

export async function main(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
	const ctx = canvas.getContext("2d");

	let clicked = false;
	let startX = 0;
	let startY = 0;

	let existingShapes: Shape[] = await getExistingShapes(roomId);

	if (!ctx) {
		return;
	}

	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);

		if (message.type == "chat") {
			const parsedShape = JSON.parse(message.message);
			existingShapes.push(parsedShape.shape);
			clearCanvas(existingShapes, canvas, ctx);
		}
	};

	canvas.addEventListener("mousedown", (e) => {
		clicked = true;
		startX = e.offsetX;
		startY = e.offsetY;
	});

	canvas.addEventListener("mouseup", () => {
		clicked = false;
	});

	canvas.addEventListener("mousemove", (e) => {
		clicked = false;
		const width = e.clientX - startX;
		const height = e.clientY - startY;

		let shape: Shape | null = null;

		if (shape == "rect") {
			shape = {
				type: "rect",
				x: startX,
				y: startY,
				height,
				width,
			};
		}

		if (!shape) {
			return;
		}

		existingShapes.push(shape);

		socket.send(JSON.stringify({ shape, roomId }));
	});
}

function clearCanvas(
	existingShapes: Shape[],
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D
) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	existingShapes.map((shape) => {
		if (shape.type === "rect") {
			ctx.strokeStyle = "rgba(255, 255, 255)";
			ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
		} else if (shape.type === "circle") {
			ctx.beginPath();
			ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.closePath();
		}
	});
}

async function getExistingShapes(roomId: string) {
	const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
	const messages = res.data.messages;

	const shapes = messages.map((x: { message: string }) => {
		const messageData = JSON.parse(x.message);
		return messageData.shape;
	});

	return shapes;
}
