"use client";
import React, { useEffect, useRef } from "react";

const CanvasPage = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			if (!ctx) return;

			ctx.strokeRect(25, 25, 100, 100);
		}
	}, [canvasRef]);

	return (
		<div>
			ewcncojkn
			<canvas ref={canvasRef} width={100} height={100}>
				{" "}
			</canvas>
		</div>
	);
};

export default CanvasPage;
